



from datetime import datetime
from enum import Enum
from unicodedata import category
from sqlalchemy import Enum as sqlEnum

from sqlalchemy.dialects.postgresql import UUID
import uuid

from sqlalchemy.orm import Mapped, mapped_column

from core.db import Base
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
    primary_key=True,default=uuid.uuid4() #it creates random id number for expenses
    )
    title:Mapped[str] #mapped column is used for extra settings of column
    description:Mapped[str | None]
    amount:Mapped[float]
    created_at:Mapped[datetime]=mapped_column(default=datetime.utcnow)
    category:Mapped[CategoryEnum]=mapped_column(sqlEnum(CategoryEnum),default=CategoryEnum.OTHERS)
