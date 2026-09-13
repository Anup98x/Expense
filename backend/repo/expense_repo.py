
from unicodedata import category
from unittest import result
from uuid import UUID
from model.expense import CategoryEnum
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from model import expense
from model.expense import Expense
from model.user import User
from schema.expense_schema import ExpenseCreate, UpdateExpense


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
    async def get_all_expense(self,user:User,
    category: CategoryEnum | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    page: int = 1,
    page_size: int = 10,):
        query = select(Expense).where(Expense.user_id==user.id)
        if category is not None: #means if category is available in expense
            query=query.where(Expense.category==category)
        if max_amount is not None:
            query=query.where(Expense.amount<=max_amount) #filter garda max amount 50k amount entered then the results must be expenses less than 50k thats why
        if min_amount is not None:
            query = query.where(Expense.amount >= min_amount)
        if start_date is not None:
            query = query.where(Expense.created_at >= start_date)#start date means searched date while filtering and created at means the expense we created
        if end_date is not None:
            query = query.where(Expense.created_at <= end_date)
 # count matching rows BEFORE paging, so the client knows total pages
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        query = (
        query.order_by(Expense.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
        expenses = (await self.session.execute(query)).scalars().all()

        return expenses, total

    async def update_expense(self,expense:Expense,data:UpdateExpense):
        for key,value in data.model_dump(exclude_unset=True).items():
            setattr(expense,key,value)
        self.session.add(expense)
        await self.session.commit()
    async def delete_expense(self,expense:Expense):

        await self.session.delete(expense)
        await self.session.commit() #saves to database
