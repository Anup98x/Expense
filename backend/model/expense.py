



from datetime import datetime
from enum import Enum
from unicodedata import category
from sqlalchemy import Enum as sqlEnum, ForeignKey

from sqlalchemy.dialects.postgresql import UUID
import uuid

from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.db import Base
from model.user import User
class CategoryEnum(Enum):
    TREK="trek"
    FUEL="fuel"
    PERSONAL="personal"
    INTERNET="internet"
    ELECTRICITY="electricity"
    OTHERS="others"
class Expense(Base): #this Base makes class a database table
    __tablename__="expenses"
    id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),
    primary_key=True,default=uuid.uuid4 #it creates random id number for expenses
    )
    title:Mapped[str] #mapped column is used for extra setting of column
    description:Mapped[str | None]
    amount:Mapped[float]
    created_at:Mapped[datetime]=mapped_column(default=datetime.utcnow)
    category:Mapped[CategoryEnum]=mapped_column(sqlEnum(CategoryEnum),default=CategoryEnum.OTHERS)
    user_id:Mapped[UUID]=mapped_column(ForeignKey("Users.id",ondelete="CASCADE")) #here we are selecting user id as foreign key and using cascade to delete all expense when the user is deleted
    user:Mapped[User]=relationship("User",backref="expenses")
