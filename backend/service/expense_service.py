
from uuid import UUID
from model.expense import CategoryEnum
from datetime import datetime
from schema.expense_schema import PaginatedExpenses
from fastapi import HTTPException
from model.user import User
from repo.expense_repo import ExpenseRepo
from schema.expense_schema import ExpenseCreate, UpdateExpense


class ExpenseService:
    def __init__(self,repo:ExpenseRepo):
        self.repo=repo
    async def create_expense_service(
            self,
            data:ExpenseCreate,
            user:User
    ):
         new_expense=await self.repo.create_expense(data,user.id)
         return new_expense
    async def get_single_expense(self,expense_id:UUID):
        expenses=await self.repo.get_expense_by_id(expense_id)
        if not expenses:
            raise HTTPException(status_code=404,detail="expense not found")
        return expenses


    async def get_expenses(
        self,
        user: User,
        category: CategoryEnum | None = None,
        min_amount: float | None = None,
        max_amount: float | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        page: int = 1,
        page_size: int = 10,
    ):
        expenses, total = await self.repo.get_all_expense(
        user=user,
        category=category,
        min_amount=min_amount,
        max_amount=max_amount,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size,
    )
        return PaginatedExpenses(
        total=total,
        page=page,
        page_size=page_size,
        items=expenses,
    )

        async def update_expense_service(
              self,
              expense_id:UUID,
              data:UpdateExpense,
              user:User
              ):
         expense=await self.repo.get_expense_by_id(expense_id) #fetching id
         if not expense or expense.user_id!=user.id:
              raise HTTPException(status_code=400,detail="Expense not found")
         await self.repo.update_expense(expense,data) #it updates the rows
    async def delete_expense_service(
              self,
              expense_id:UUID,
              user:User
              ):
         expense=await self.repo.get_expense_by_id(expense_id) #fetching id
         if not expense or expense.user_id!=user.id:
             return
         await self.repo.delete_expense(expense) #it  deletes the whole row
