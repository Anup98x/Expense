
from unicodedata import category
from unittest import result
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from model import expense
from model.expense import Expense
from model.user import User
from schema.expense_schema import ExpenseCreate


class ExpenseRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_expense(
            self,
            data:ExpenseCreate,
            user_id:UUID

    ):
        new=Expense(
            title=data.title,
            description=data.description,
            amount=data.amount,
            created_at=data.created_at,
            category=data.category,
            user_id=user_id

        )
        self.session.add(new)
        await self.session.commit()
        return new
    async def get_expense_by_id(self,expense_id:UUID):
        query=select(Expense).where(Expense.id==expense_id)
        expense=(await self.session.execute(query)).scalar_one_or_none()
        return expense

    #creating for read endpoint
    async def get_all_expense(self,user:User):
        expenses=(await self.session.execute(select(Expense).where(Expense.user==user))).scalars().all()
        return expenses
