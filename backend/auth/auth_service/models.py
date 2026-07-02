from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import List


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
