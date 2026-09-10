
from uuid import UUID

from fastapi import HTTPException
from
from model.user import User
from repo.expense_repo import ExpenseRepo
from schema.expense_schema import ExpenseCreate


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


    async def get_expenses(self,user:User):
            expenses=await self.repo.get_all_expense(user)
            return expenses

    async def update_expense_service(
              self,
              expense_id:UUID,
              data:ExpenseCreate,
              user:User
              ):
         expense=await self.repo.get_expense_by_id(expense_id) #fetching id
         if not expense or expense.user_id!=user.id:
              raise HTTPException(status_code=400,detail="Expense not found")
