import os
import time

from datetime import date as Date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound, MultipleResultsFound
from pydantic import BaseModel, Field
from typing import Annotated

from timesheets_service.models import Record

# Set the desired time zone
os.environ['TZ'] = 'Europe/Moscow'
time.tzset()


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
async def delete_record(record_id: int, user_id: int):
  with Session(engine) as session:
    stmt = select(Record).where(Record.id == record_id, Record.user_id == user_id)
    try:
      record = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong record_id or user_id.",
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
        "message": "Wrong record_id or user_id, or record deleted.",
      }
    
    record.date = body.date
    record.minutes = body.minutes
    session.commit()

  return {
    "success": True, 
  }


@app.get("/records")
async def get_records(userId: Annotated[int, Field(gt=0)]):  
  with Session(engine) as session:
    stmt = select(Record).where(Record.user_id == userId, Record.deleted == False)
    records = session.scalars(stmt).all()

  return {
    "success": True,
    "data": records
  }


@app.get("/record")
async def get_record(userId: Annotated[int, Field(gt=0)], recordId: Annotated[int, Field(gt=0)]):  
  with Session(engine) as session:
    stmt = select(Record).where(Record.user_id == userId, Record.deleted == False, Record.id == recordId)
    try: 
      record = session.scalars(stmt).one()
    except (NoResultFound, MultipleResultsFound):
      return {
        "success": False,
        "message": "Wrong userId, recordId, or record is deleted."
      }

  return {
    "success": True,
    "data": record
  }
