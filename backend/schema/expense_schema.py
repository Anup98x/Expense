






from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from sqlalchemy import Float

from model.expense import CategoryEnum


class ExpenseCreate(BaseModel): # Basemodel tells to python to verify the data in apiendpoint
    title:str
    description:str | None
    amount:float
    created_at:datetime
    category:CategoryEnum
