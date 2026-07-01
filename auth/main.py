import os
import time
import bcrypt
import re

from datetime import datetime, timedelta
from fastapi import FastAPI, status, Response
from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from pydantic import BaseModel, Field, BeforeValidator, AfterValidator, model_validator
from typing import Annotated
from typing_extensions import Self
from enum import Enum
from uuid import uuid4

from .models import User, Token

# Set the desired time zone
os.environ['TZ'] = 'Europe/Moscow'
time.tzset()

email_pattern = re.compile("^[\w\d]+@[\w\d]+\.[\w\d]{2,}$")

EMAIL_MIN_LENGTH = 6
PASSWORD_MIN_LENGTH = 8


class TokenType(Enum):
  access = 'access'
  refresh = 'refresh'
  reset = 'reset'


app = FastAPI()
engine = create_engine(
    "sqlite:///sqlite.db", connect_args={"autocommit": False}
)


def truncate(value: any) -> str:
  if (isinstance(value, str)):
    return value.strip()
  
  raise ValueError(f'{value} is not a string.')


def check_email(value: str) -> str:
  if (email_pattern.match(value)):
    return value

  raise ValueError(f'{value} is not a valid email.')


def no_whitespace(value: str) -> str:
  if (re.search(r"\s", value)):
    raise ValueError("Whitespace is not allowed.")
  
  return value


class SignupBody(BaseModel):
  fullname: Annotated[str, Field(min_length=3), BeforeValidator(truncate)]
  email: Annotated[str, Field(min_length=EMAIL_MIN_LENGTH), AfterValidator(no_whitespace), AfterValidator(check_email)]
  password: Annotated[str, Field(min_length=PASSWORD_MIN_LENGTH), AfterValidator(no_whitespace)]
  password_repeat: Annotated[str, Field(min_length=PASSWORD_MIN_LENGTH), AfterValidator(no_whitespace)]

  @model_validator(mode='after')
  def compare_passwords(self) -> Self:
    if self.password != self.password_repeat:
      raise ValueError(f'password is not equal to password_repeat.')
    
    return self
  

class LoginBody(BaseModel):
  email: Annotated[str, Field(min_length=EMAIL_MIN_LENGTH), AfterValidator(no_whitespace), AfterValidator(check_email)]
  password: Annotated[str, Field(min_length=PASSWORD_MIN_LENGTH), AfterValidator(no_whitespace)]


def get_hashed_password(plain_text_password):
    return bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(plain_text_password, hashed_password):
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password)

def generate_token():
  return str(uuid4())


@app.post("/signup")
async def signup(form: SignupBody):
  user_dict = form

  unique_email = False
  with Session(engine) as session:
    stmt = select(User).where(User.email == user_dict.email)
    try:
      user = session.scalars(stmt).one()
    except NoResultFound:
      unique_email = True

  if not unique_email:
    return {
      "success": False,
      "error": "Email is occupied. Try different one."
    }
  
  with Session(engine) as session:
    access_token = generate_token()
    refresh_token = generate_token()
    new_user = User(
      fullname=user_dict.fullname,
      email=user_dict.email,
      password_hash=get_hashed_password(user_dict.password),
      tokens=[
        Token(value=access_token, type=TokenType.access.value, expires=datetime.now() + timedelta(hours=24)),
        Token(value=refresh_token, type=TokenType.refresh.value, expires=datetime.now() + timedelta(days=7)),
      ]
    )
    session.add(new_user)
    session.commit()


  return {
    "success": True,
    "access_token": access_token,
    "refresh_token": refresh_token,  
  }


@app.post("/login")
async def login(form: LoginBody):
  login_dict = form

  with Session(engine) as session:
    stmt = select(User).where(User.email == login_dict.email)
    try:
      user = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "error": "Wrong email or password.",
      }
  
  if (not check_password(login_dict.password, user.password_hash.encode('utf-8'))):
    return {
      "success": False,
      "error": "Wrong email or password.",
    }
  
  with Session(engine) as session:
    # удалить старые токены
    stmt = delete(Token).where(Token.user_id == user.id, Token.type.in_([TokenType.access.value, TokenType.refresh.value]))
    session.execute(stmt)
    session.commit()

    # создать новые токены и отправить на фронт
    access_token = generate_token()
    refresh_token = generate_token()
    token_list = [
      Token(user_id=user.id, value=access_token, type=TokenType.access.value, expires=datetime.now() + timedelta(hours=24)),
      Token(user_id=user.id, value=refresh_token, type=TokenType.refresh.value, expires=datetime.now() + timedelta(days=7)),
    ]
    session.add_all(token_list)
    session.commit()

  return {
    "success": True,
    "access_token": access_token,
    "refresh_token": refresh_token,  
  }


@app.post("/logout")
async def logout(access_token: str):
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.access.value, Token.value == access_token)
    try:
      token = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "error": "Wrong token.",
      }

    if token:  
      session.delete(token)
      session.commit()

      return {
        "success": True
      }
    
  return {
    "success": False,
    "error": "Something went wrong."
  }


@app.post("/check")
async def check(access_token: str, response: Response):
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.access.value, Token.value == access_token, Token.expires > datetime.now())
    try:
      token = session.scalars(stmt).one()
    except NoResultFound:
      response.status_code = status.HTTP_403_FORBIDDEN
      return {
        "success": False,
        "error": "Wrong token.",
      }

  if token:
    return {
      "success": True,
    }
    
  response.status_code = status.HTTP_403_FORBIDDEN
  return {
    "success": False,
    "error": "Something went wrong.",
  }


@app.post("/refresh")
async def refresh(refresh_token: str, response: Response):
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.refresh.value, Token.value == refresh_token, Token.expires > datetime.now())
    try:
      token = session.scalars(stmt).one()
    except NoResultFound:
      response.status_code = status.HTTP_403_FORBIDDEN
      return {
        "success": False,
        "error": "Wrong token.",
      }

  if token:
    with Session(engine) as session:
      # удалить старые токены
      stmt = delete(Token).where(Token.user_id == token.user_id, Token.type.in_([TokenType.access.value, TokenType.refresh.value]))
      session.execute(stmt)
      session.commit()

      # создать новые токены и отправить на фронт
      access_token = generate_token()
      refresh_token = generate_token()
      token_list = [
        Token(user_id=token.user_id, value=access_token, type=TokenType.access.value, expires=datetime.now() + timedelta(hours=24)),
        Token(user_id=token.user_id, value=refresh_token, type=TokenType.refresh.value, expires=datetime.now() + timedelta(days=7)),
      ]
      session.add_all(token_list)
      session.commit()

    return {
      "success": True,
      "access_token": access_token,
      "refresh_token": refresh_token, 
    }
    
  response.status_code = status.HTTP_403_FORBIDDEN
  return {
    "success": False,
    "error": "Something went wrong.",
  }


@app.get("/users")
async def get_users():  
  with Session(engine) as session:
    stmt = select(User)
    users = session.scalars(stmt).all()
    mapped_users = [{
      'id': user.id,
      'email': user.email,
      'fullname': user.fullname,
    } for user in users]

  return {
    "success": True,
    "data": mapped_users
  }


@app.get("/user")
async def get_user(access_token: str):  
  with Session(engine) as session:
    stmt = select(Token).where(Token.value==access_token)
    try:
      token = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "error": "Wrong token.",
      }
    user = token.user

    mapped_user = {
      'id': user.id,
      'email': user.email,
      'fullname': user.fullname,
    }

  return {
    "success": True,
    "data": mapped_user,
  }