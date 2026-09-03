






from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Float
from uvicorn import Config

from model.expense import CategoryEnum


class ExpenseCreate(BaseModel): # Basemodel tells to python to verify the data in apiendpoint
    title:str
    description:str | None
    amount:float
    created_at:datetime
    category:CategoryEnum

class SingleExpense(ExpenseCreate):
    id:UUID
    model_config=ConfigDict(from_attributes=True)
