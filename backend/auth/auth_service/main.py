import os
import time
import bcrypt
import re

from datetime import datetime, timedelta
from fastapi import FastAPI, status, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import Session
from sqlalchemy import exc
from pydantic import BaseModel, Field, BeforeValidator, AfterValidator
from typing import Annotated
from enum import Enum
from uuid import uuid4

from auth_service.models import User, Token

# Set the desired time zone
os.environ['TZ'] = 'Europe/Moscow'
time.tzset()

email_pattern = re.compile("^[\w\d]+@[\w\d]+\.[\w\d]{2,}$")

EMAIL_MIN_LENGTH = 6
PASSWORD_MIN_LENGTH = 8
SUCCESS_FLAG_NAME = 'success'
MESSAGE_NAME = 'message'
TOKEN_ACCESS_NAME = 'access_token'
TOKEN_REFRESH_NAME = 'refresh_token'

class TokenType(Enum):
  access = 'access'
  refresh = 'refresh'
  reset = 'reset'



app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    # change to frontend server host
    'http://localhost:8081'
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

engine = create_engine(
  "sqlite:////app/sqlite.db", connect_args={"autocommit": False}
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
async def signup(response: Response, form: SignupBody):
  user_dict = form

  unique_email = False
  with Session(engine) as session:
    stmt = select(User).where(User.email == user_dict.email)
    try:
      user = session.scalars(stmt).one()
    except exc.NoResultFound:
      unique_email = True

  if not unique_email:
    response.status_code = status.HTTP_400_BAD_REQUEST
    return {
      SUCCESS_FLAG_NAME: False,
      MESSAGE_NAME: "Email is occupied. Try different one."
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
    SUCCESS_FLAG_NAME: True,
    TOKEN_ACCESS_NAME: access_token,
    TOKEN_REFRESH_NAME: refresh_token,  
  }


@app.post("/login")
async def login(response: Response, form: LoginBody):
  login_dict = form

  with Session(engine) as session:
    stmt = select(User).where(User.email == login_dict.email)
    try:
      user = session.scalars(stmt).one()
    except exc.NoResultFound:
      response.status_code = status.HTTP_404_NOT_FOUND
      return {
        SUCCESS_FLAG_NAME: False,
        MESSAGE_NAME: "Wrong email or password.",
      }
  
  if (not check_password(login_dict.password, user.password_hash.encode('utf-8'))):
    response.status_code = status.HTTP_404_NOT_FOUND
    return {
      SUCCESS_FLAG_NAME: False,
      MESSAGE_NAME: "Wrong email or password.",
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
    SUCCESS_FLAG_NAME: True,
    TOKEN_ACCESS_NAME: access_token,
    TOKEN_REFRESH_NAME: refresh_token,  
  }


@app.post("/logout")
async def logout(response: Response, access_token: Annotated[str | None, Header()] = None):
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.access.value, Token.value == access_token)
    try:
      token = session.scalars(stmt).one()
    except exc.NoResultFound:
      response.status_code = status.HTTP_404_NOT_FOUND
      return {
        SUCCESS_FLAG_NAME: False,
        MESSAGE_NAME: "Wrong access token.",
      }

    if token:  
      session.delete(token)
      session.commit()

      return {
        SUCCESS_FLAG_NAME: True
      }
    
  response.status_code = status.HTTP_400_BAD_REQUEST
  return {
    SUCCESS_FLAG_NAME: False,
    MESSAGE_NAME: "Something went wrong."
  }


def get_access_token(access_token: str) -> Token | None:
  token = None
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.access.value, Token.value == access_token, Token.expires >= datetime.now())
    try:
      token = session.scalars(stmt).one()
    except exc.NoResultFound:
      pass

  return token

@app.get("/verify")
async def verify(response: Response, access_token: Annotated[str | None, Header()] = None):
  token = get_access_token(access_token)
  if not token:
    response.status_code = status.HTTP_403_FORBIDDEN
    return {
      SUCCESS_FLAG_NAME: False,
      MESSAGE_NAME: "Wrong access token or access token expired",
    }

  return {
    SUCCESS_FLAG_NAME: True,
  }


@app.post("/refresh")
async def refresh(refresh_token: str, response: Response):
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.refresh.value, Token.value == refresh_token, Token.expires >= datetime.now())
    try:
      token = session.scalars(stmt).one()
    except exc.NoResultFound:
      response.status_code = status.HTTP_403_FORBIDDEN
      return {
        SUCCESS_FLAG_NAME: False,
        MESSAGE_NAME: "Wrong refresh token or refresh token expired",
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
      SUCCESS_FLAG_NAME: True,
      TOKEN_ACCESS_NAME: access_token,
      TOKEN_REFRESH_NAME: refresh_token, 
    }
    
  response.status_code = status.HTTP_403_FORBIDDEN
  return {
    SUCCESS_FLAG_NAME: False,
    MESSAGE_NAME: "Something went wrong.",
  }


@app.get("/users")
async def get_users(response: Response, access_token: Annotated[str | None, Header()] = None):
  token = get_access_token(access_token)
  if not token:
    response.status_code = status.HTTP_403_FORBIDDEN
    return {
      SUCCESS_FLAG_NAME: False,
      MESSAGE_NAME: "Wrong access token or access token expired.",
    }
  
  with Session(engine) as session:
    stmt = select(User)
    users = session.scalars(stmt).all()
    mapped_users = [{
      'id': user.id,
      'email': user.email,
      'fullname': user.fullname,
    } for user in users]

  return {
    SUCCESS_FLAG_NAME: True,
    "data": mapped_users
  }


@app.get("/self")
async def get_self(response: Response, access_token: Annotated[str | None, Header()] = None):
  token = None
  with Session(engine) as session:
    stmt = select(Token).where(Token.type == TokenType.access.value, Token.value == access_token, Token.expires >= datetime.now())
    try:
      token = session.scalars(stmt).one()
    except exc.NoResultFound:
      response.status_code = status.HTTP_403_FORBIDDEN
      return {
        SUCCESS_FLAG_NAME: False,
        MESSAGE_NAME: "Wrong access token or access token expired.",
      }

    user = token.user
  mapped_user = {
    'id': user.id,
    'email': user.email,
    'fullname': user.fullname,
  }

  return {
    SUCCESS_FLAG_NAME: True,
    "data": mapped_user,
  }