
from unicodedata import category

from sqlalchemy.ext.asyncio import AsyncSession

from model.expense import Expense
from schema.expense_schema import ExpenseCreate


class ExpenseRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_expense(
            self,
            data:ExpenseCreate
    ):
        new=Expense(
            title=data.title,
            description=data.description,
            amount=data.amount,
            created_at=data.created_at,
            category=data.category

        )
        self.session.add(new)
        await self.session.commit()
        return new
