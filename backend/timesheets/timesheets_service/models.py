from typing import List
from datetime import date as Date, datetime
from sqlalchemy import Text, String, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
  pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
      server_default=func.now(),  # Database generates the time on insert
      nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
      server_default=func.now(),  # Database generates initial time
      onupdate=func.now(),        # SQLAlchemy refreshes it automatically on updates
      nullable=False
    )


class Record(TimestampMixin, Base):
  __tablename__ = 'record'
  id: Mapped[int] = mapped_column(primary_key=True)
  user_id: Mapped[int] = mapped_column(nullable=False)
  minutes: Mapped[int] = mapped_column(nullable=False)
  date: Mapped[Date] = mapped_column(nullable=False)
  deleted: Mapped[bool] = mapped_column(default=False)
  comment: Mapped[str] = mapped_column(Text)
  task_id: Mapped[int] = mapped_column(ForeignKey("task.id"))
  task: Mapped["Task"] = relationship(back_populates="records")

  def __repr__(self) -> str:
    return f"Record(id={self.id!r}, user_id={self.user_id!r}, date={self.date!r}, minutes={self.minutes!r})"


class Project(TimestampMixin, Base):
  __tablename__ = 'project'
  id: Mapped[int] = mapped_column(primary_key=True)
  deleted: Mapped[bool] = mapped_column(default=False)
  title: Mapped[str] = mapped_column(String(255))
  code: Mapped[str] = mapped_column(String(255), unique=True)
  description: Mapped[str] = mapped_column(Text)
  tasks: Mapped[List["Task"]] = relationship(
    back_populates="project",
    cascade="all, delete-orphan"
  )

  def __repr__(self) -> str:
    return f"Project(id={self.id!r}, title={self.title!r}, code={self.code!r})"


class Task(TimestampMixin, Base):
  __tablename__ = 'task'
  id: Mapped[int] = mapped_column(primary_key=True)
  deleted: Mapped[bool] = mapped_column(default=False)
  title: Mapped[str] = mapped_column(String(255))
  code: Mapped[str] = mapped_column(String(255), unique=True)
  description: Mapped[str] = mapped_column(Text)
  project_id: Mapped[int] = mapped_column(ForeignKey("project.id"))
  project: Mapped["Project"] = relationship(back_populates="tasks")
  records: Mapped[List["Record"]] = relationship(
    back_populates="task",
    cascade="all, delete-orphan"
  )

  def __repr__(self) -> str:
    return f"Task(id={self.id!r}, title={self.title!r}, code={self.code!r})"
  