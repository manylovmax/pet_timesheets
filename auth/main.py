import re
import bcrypt

from datetime import datetime, timedelta
from fastapi import FastAPI
from sqlalchemy import create_engine, ForeignKey, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session
from sqlalchemy.exc import NoResultFound
from pydantic import BaseModel, Field, BeforeValidator, AfterValidator, model_validator
from typing import Annotated, List
from typing_extensions import Self
from enum import Enum
from uuid import uuid4

email_pattern = re.compile("^[^@]+@[^@]+\.[^@]{2,}$")


class TokenType(Enum):
  access = 'access'
  refresh = 'refresh'
  reset = 'reset'


class OrmBase(DeclarativeBase):
  pass

class User(OrmBase):
  __tablename__ = 'user'
  id: Mapped[int] = mapped_column(primary_key=True)
  fullname: Mapped[str]
  email: Mapped[str]
  password_hash: Mapped[str]
  tokens: Mapped[List["Token"]] = relationship(back_populates="user", cascade="all")

  def __repr__(self) -> str:
    return f"User(id={self.id!r}, fullname={self.fullname!r}, email={self.email!r})"


class Token(OrmBase):
  __tablename__ = 'token'
  id: Mapped[int] = mapped_column(primary_key=True)
  user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
  user: Mapped["User"] = relationship(back_populates="tokens")
  type: Mapped[str]
  value: Mapped[str]
  expires: Mapped[datetime]

  def __repr__(self) -> str:
    return f"Token(id={self.id!r}, type={self.type!r}, value={self.value!r}, expires={self.expires!r})"


app = FastAPI()
engine = create_engine(
    "sqlite:///sqlite.db", connect_args={"autocommit": False}
)


def truncate(value: any) -> str:
  if (isinstance(value, str)):
    return value.strip()
  
  raise ValueError(f'{value} is not a string')


def check_email(value: str) -> str:
  if (email_pattern.match(value)):
    return value

  raise ValueError(f'{value} is not a valid email')


class SignupBody(BaseModel):
  fullname: Annotated[str, Field(min_length=3), BeforeValidator(truncate)]
  email: Annotated[str, Field(min_length=4), BeforeValidator(truncate), AfterValidator(check_email)]
  password: Annotated[str, Field(min_length=8), BeforeValidator(truncate)]
  password_repeat: Annotated[str, Field(min_length=8), BeforeValidator(truncate)]

  @model_validator(mode='after')
  def compare_passwords(self) -> Self:
    if self.password != self.password_repeat:
      raise ValueError(f'password is not equal to password_repeat')
    
    return self


def get_hashed_password(plain_text_password):
    # Hash a password for the first time
    #   (Using bcrypt, the salt is saved into the hash itself)
    return bcrypt.hashpw(plain_text_password, bcrypt.gensalt())

def check_password(plain_text_password, hashed_password):
    # Check hashed password. Using bcrypt, the salt is saved into the hash itself
    return bcrypt.checkpw(plain_text_password, hashed_password)

def generate_access_token():
  return uuid4()


@app.post("/signup")
async def signup(form: SignupBody):
  user_dict = form.model_dump()

  unique_email = False
  session = Session(engine)
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
  
  with session:
    access_token = generate_access_token()
    refresh_token = generate_access_token()
    new_user = User(
      fullname=user_dict.fullname,
      email=user_dict.email,
      pasword_hash=get_hashed_password(user_dict.password),
      tokens=[
        Token(value=access_token, type=TokenType.access, expires=datetime.now() + timedelta(hours=24)),
        Token(value=refresh_token, type=TokenType.refresh, expires=datetime.now() + timedelta(days=7)),
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
async def login():
  return {"message": "Hello World"}


@app.post("/logout")
async def logout():
  return {"message": "Hello World"}


@app.post("/check")
async def check():
  return {"message": "Hello World"}


@app.post("/refresh")
async def refresh():
  return {"message": "Hello World"}

