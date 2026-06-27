import re

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String, DateTime, ForeignKey
from pydantic import BaseModel, Field, BeforeValidator, AfterValidator, model_validator
from typing import Annotated
from typing_extensions import Self

email_pattern = re.compile("^[^@]+@[^@]+\.[^@]{2,}$")

metadata_obj = MetaData()

user_table = Table(
  "user",
  metadata_obj,
  Column("id", Integer, primary_key=True),
  Column("fullname", String),
  Column("email", String),
  Column("password_hash", String),
)

token_table = Table(
  "token",
  metadata_obj,
  Column("id", Integer, primary_key=True),
  Column("user_id", ForeignKey("user.id"), nullable=False),
  Column("type", String),
  Column("value", String),
  Column("expires", DateTime),
)


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


@app.post("/signup")
async def signup(form: SignupBody):
  user_dict = form.model_dump()
  return {"message": "Hello World"}


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

