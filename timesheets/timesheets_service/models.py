from datetime import date as Date
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
  pass


class Record(Base):
  __tablename__ = 'record'
  id: Mapped[int] = mapped_column(primary_key=True)
  user_id: Mapped[int] = mapped_column(nullable=False)
  minutes: Mapped[int] = mapped_column(nullable=False)
  date: Mapped[Date] = mapped_column(nullable=False)
  deleted: Mapped[bool] = mapped_column(default=False)

  def __repr__(self) -> str:
    return f"Record(id={self.id!r}, user_id={self.user_id!r}, date={self.date!r}, minutes={self.minutes!r})"
