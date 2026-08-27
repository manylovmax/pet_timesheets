from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session
from datetime import datetime

from auth_service.models import Token

engine = create_engine(
  "sqlite:////app/sqlite.db", connect_args={"autocommit": False}
  # "sqlite:////home/user/projects/pet_timesheets/backend/auth/sqlite.db", connect_args={"autocommit": False}
)

with Session(engine) as session:
  stmt = delete(Token).where(Token.expires <= datetime.now())
  session.execute(stmt)
  session.commit()
