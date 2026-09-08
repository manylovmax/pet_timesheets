import os
import time

import httpx

from datetime import date as Date, datetime
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound, MultipleResultsFound
from pydantic import BaseModel, Field
from typing import Annotated

from timesheets_service.models import Record, Project, Task

# Set the desired time zone
os.environ['TZ'] = 'Europe/Moscow'
time.tzset()


app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    # change to frontend server host
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
engine = create_engine(
#  "sqlite:////app/sqlite.db", connect_args={"autocommit": False}
#  "sqlite:////home/user/projects/pet_timesheets/backend/timesheets/sqlite.db", connect_args={"autocommit": False}
  "postgresql+psycopg://timesheets:easypass@timesheets_db:5432/timesheets"
)

AUTH_SERVICE_HOST = 'http://auth_service:80'


# helper function for checking access token

async def get_user_id(access_token: str | None) -> int | None:
  if not access_token:
    return None
  
  async with httpx.AsyncClient() as client:
    try:
      response = await client.get(AUTH_SERVICE_HOST + '/self', headers={'access-token': access_token})
      response.raise_for_status() # Raises an error for 4xx/5xx status codes
      response = response.json()
      return response.get('data', {}).get('id')
    except httpx.HTTPStatusError as exc:
      raise HTTPException(status_code=exc.response.status_code, detail="External API error")
    except httpx.RequestError:
      raise HTTPException(status_code=503, detail="External API unreachable")


# Records API

class RecordCreate(BaseModel):
  task_id: Annotated[int, Field(gt=0)]
  date: Date
  minutes: Annotated[int, Field(gt=0)]
  comment: str


class RecordUpdate(RecordCreate):
  record_id: Annotated[int, Field(gt=0)]


class RecordsFilter(BaseModel):
  startDate: str
  endDate: str 


@app.post("/record")
async def create_record(body: RecordCreate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    new_record = Record(
      user_id=user_id,
      task_id=body.task_id,
      date=body.date,
      minutes=body.minutes,
      comment=body.comment,
    )
    session.add(new_record)
    session.commit()

  return {
    "success": True, 
  }


@app.delete("/record")
async def delete_record(record_id: int, access_token: Annotated[str | None, Header()] = None):
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
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
async def update_record(body: RecordUpdate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Record).where(Record.id == body.record_id, Record.user_id == user_id, Record.deleted == False)
    try:
      record = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong record_id or user_id, or record deleted.",
      }
    
    record.date = body.date
    record.minutes = body.minutes
    record.comment = body.comment
    record.task_id = body.task_id
    session.commit()

  return {
    "success": True, 
  }


@app.get("/records")
async def get_records(access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Record).where(Record.user_id == user_id, Record.deleted == False)
    records = session.scalars(stmt).all()

  return {
    "success": True,
    "data": records
  }


@app.get("/record")
async def get_record(record_id: Annotated[int, Field(gt=0)], access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Record).where(Record.user_id == user_id, Record.deleted == False, Record.id == record_id)
    try: 
      record = session.scalars(stmt).one()
    except (NoResultFound, MultipleResultsFound):
      return {
        "success": False,
        "message": "Wrong user_id, record_id, or record is deleted."
      }

  return {
    "success": True,
    "data": record
  }


@app.post("/records-for-period")
async def get_records_for_period(body: RecordsFilter, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }

  try:
    start_date = datetime.strptime(body.startDate, "%Y-%m-%d").date()
    end_date = datetime.strptime(body.endDate, "%Y-%m-%d").date()
  except:
    pass
  
  with Session(engine) as session:
    stmt = select(Record).where(
      Record.user_id == user_id, 
      Record.deleted == False,
      Record.date >= start_date,
      Record.date <= end_date,
    )
    records = session.scalars(stmt).all()
    mapped_records = [{
      'id': r.id,
      'user_id': r.user_id,
      'minutes': r.minutes,
      'date': r.date,
      'comment': r.comment,
      'task_id': r.task_id,
      'task_title': r.task.title,
    } for r in records]

  return {
    "success": True,
    "data": mapped_records,
  }


# Projects API

class ProjectCreate(BaseModel):
  title: str
  description: str
  code: str

class ProjectUpdate(ProjectCreate):
  project_id: Annotated[int, Field(gt=0)]


@app.get("/projects")
async def get_projects(access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Project).where(Project.user_id == user_id, Project.deleted == False)
    projects = session.scalars(stmt).all()

  return {
    "success": True,
    "data": projects
  }


@app.get("/project")
async def get_project(project_id: Annotated[int, Field(gt=0)], access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Project).where(Project.user_id == user_id, Project.deleted == False, Project.id == project_id)
    try: 
      project = session.scalars(stmt).one()
    except (NoResultFound, MultipleResultsFound):
      return {
        "success": False,
        "message": "Wrong user_id, project_id, or project is deleted."
      }

  return {
    "success": True,
    "data": project
  }


@app.post("/project")
async def create_project(body: ProjectCreate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Project).where(Project.user_id == user_id, 
                                 Project.deleted == False,
                                 Project.code == body.code)
    projects = session.scalars(stmt).all()
    if len(projects):
      return {
        "success": False,
        "message": "Duplicate project codes are prohibited for not deleted projects."
      }


  with Session(engine) as session:
      new_project = Project(
        user_id=user_id,
        description=body.description,
        title=body.title,
        code=body.code,
      )
      session.add(new_project)
      session.commit()

  return {
    "success": True, 
  }


@app.delete("/project")
async def delete_project(project_id: int, access_token: Annotated[str | None, Header()] = None):
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    try:
      project = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong project_id or user_id.",
      }
    project.deleted = True
    session.commit()

  return {
    "success": True, 
  }


@app.patch("/project")
async def update_project(body: ProjectUpdate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Project).where(Project.id == body.project_id, Project.user_id == user_id, Project.deleted == False)
    try:
      project = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong project_id or user_id, or project is deleted.",
      }

    project = None
    stmt = select(Project).where(Project.code == body.code, Project.user_id == user_id, Project.deleted == False)
    try:
      project = session.scalars(stmt).one()
    except NoResultFound:
      pass

    if project:
      return {
        "success": False,
        "message": "Project with the same code and project_id and user_id already exists and not deleted. Not deleted projects with the same code are prohibited.",
      }
    
    project.title = body.title
    project.description = body.description
    project.code = body.code
    session.commit()

  return {
    "success": True, 
  }


# Tasks API

class TaskCreate(BaseModel):
  project_id: Annotated[int, Field(gt=0)]
  title: str
  description: str
  code: str

class TaskUpdate(ProjectCreate):
  task_id: Annotated[int, Field(gt=0)]


@app.get("/tasks")
async def get_tasks(access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Task).where(Task.user_id == user_id, Task.deleted == False)
    tasks = session.scalars(stmt).all()

  return {
    "success": True,
    "data": tasks
  }


@app.get("/task")
async def get_task(task_id: Annotated[int, Field(gt=0)], access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Task).where(Task.user_id == user_id, Task.deleted == False, Task.id == task_id)
    try: 
      task = session.scalars(stmt).one()
    except (NoResultFound, MultipleResultsFound):
      return {
        "success": False,
        "message": "Wrong userId, taskId, or task is deleted."
      }

  return {
    "success": True,
    "data": task
  }


@app.post("/task")
async def create_task(body: TaskCreate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Task).where(Task.user_id == user_id, 
                              Task.deleted == False,
                              Task.code == body.code)
    tasks = session.scalars(stmt).all()
    if len(tasks):
      return {
        "success": False,
        "message": "Duplicate task codes are prohibited for not deleted tasks."
      }


  with Session(engine) as session:
      new_task = Task(
        user_id=user_id,
        description=body.description,
        title=body.title,
        code=body.code,
        project_id=body.project_id
      )
      session.add(new_task)
      session.commit()

  return {
    "success": True, 
  }


@app.delete("/task")
async def delete_task(task_id: int, access_token: Annotated[str | None, Header()] = None):
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    try:
      task = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong project_id or user_id.",
      }
    task.deleted = True
    session.commit()

  return {
    "success": True, 
  }


@app.patch("/task")
async def update_task(body: TaskUpdate, access_token: Annotated[str | None, Header()] = None):  
  user_id = await get_user_id(access_token)
  if not user_id:
    return {
      "success": False,
      "message": "Wrong access-token header."
    }
  
  with Session(engine) as session:
    stmt = select(Task).where(Task.id == body.task_id, Task.user_id == user_id, Task.deleted == False)
    try:
      task = session.scalars(stmt).one()
    except NoResultFound:
      return {
        "success": False,
        "message": "Wrong task_id or user_id, or task is deleted.",
      }

    task = None
    stmt = select(Task).where(Task.code == body.code, Task.user_id == user_id, Task.deleted == False)
    try:
      task = session.scalars(stmt).one()
    except NoResultFound:
      pass

    if task:
      return {
        "success": False,
        "message": "Task with the same code and task_id and user_id already exists and not deleted. Not deleted tasks with the same code are prohibited.",
      }
    
    task.title = body.title
    task.description = body.description
    task.code = body.code
    session.commit()

  return {
    "success": True, 
  }
