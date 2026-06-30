import os
import time

from datetime import date as Date
from fastapi import FastAPI
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from pydantic import BaseModel, Field
from typing import Annotated

from .models import Record

# Set the desired time zone
os.environ['TZ'] = 'Europe/Moscow'
time.tzset()


app = FastAPI()
engine = create_engine(
    "sqlite:///sqlite.db", connect_args={"autocommit": False}
)
  

class RecordCreate(BaseModel):
  user_id: Annotated[int, Field(gt=0)]
  date: Date
  minutes: Annotated[int, Field(gt=0)]


class RecordUpdate(BaseModel):
  record_id: Annotated[int, Field(gt=0)]
  user_id: Annotated[int, Field(gt=0)]
  date: Date
  minutes: Annotated[int, Field(gt=0)]


@app.post("/record")
async def create_record(body: RecordCreate):  
  with Session(engine) as session:
    new_record = Record(
      user_id=body.user_id,
      date=body.date,
      minutes=body.minutes,
    )
    session.add(new_record)
    session.commit()

  return {
    "success": True, 
  }


@app.delete("/record")
async def delete_record(record_id: int):
  with Session(engine) as session:
    stmt = select(Record).where(Record.id == record_id)
    try:
      record = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "error": "Wrong record id.",
      }
    record.deleted = True
    session.commit()

  return {
    "success": True, 
  }


@app.patch("/record")
async def update_record(body: RecordUpdate):  
  with Session(engine) as session:
    stmt = select(Record).where(Record.id == body.record_id, Record.user_id == body.user_id, Record.deleted == False)
    try:
      record = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "error": "Wrong record_id or user_id, or record deleted.",
      }
    
    record.date = body.date
    record.minutes = body.minutes
    record.minutes = body.minutes
    session.commit()

  return {
    "success": True, 
  }


@app.get("/records")
async def get_records(user_id: Annotated[int, Field(gt=0)]):  
  with Session(engine) as session:
    stmt = select(Record).where(Record.user_id == user_id, Record.deleted == False)
    records = session.scalars(stmt).all()
    if not records.count:
      return {
        "success": False,
        "error": "Wrong record_id or user_id.",
      }

  return {
    "success": True,
    "data": records
  }