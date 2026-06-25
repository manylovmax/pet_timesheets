from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String, DateTime

metadata_obj = MetaData()

user_table = Table(
  "user",
  metadata_obj,
  Column("id", Integer, primary_key=True),
  Column("fullname", String),
  Column("password_hash", String),
)

token_table = Table(
  "token",
  metadata_obj,
  Column("id", Integer, primary_key=True),
  Column("value", String),
  Column("expires", DateTime),
)

app = FastAPI()
engine = create_engine("sqlite+pysqlite:///:memory:", echo=True)

@app.post("/signup")
async def signup():
  return {"message": "Hello World"}


@app.post("/login")
async def login():
  return {"message": "Hello World"}


@app.post("/logout")
async def logout():
  return {"message": "Hello World"}

