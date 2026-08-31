from datetime import datetime
from enum import Enum
import uuid
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import ENUM,UUID
from sqlalchemy.orm import Mapped,mapped_column

from core.db import Base



class ExpenseCategory(str,Enum):
 OTHERS="others"
 FOOD="food"
 GROCERY="grocery"
 TRIP="trip"
 STUDY="study"


class Expense(Base):
    __tablename__="expenses"
    id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),default=uuid.uuid4,primary_key=True)
    expense_name:Mapped[str]
    expense_description:Mapped[str|None]
    expense_category:Mapped[ExpenseCategory]=mapped_column(ENUM(ExpenseCategory,name="expense_category"),default=ExpenseCategory.FOOD)
    expense_amount:Mapped[float]=mapped_column(default=0)
    expense_date:Mapped[datetime]
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=func.now())
    updated_at:Mapped[datetime]=mapped_column(onupdate=func.now(),default=func.now())
