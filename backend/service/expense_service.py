





from uuid import UUID

from fastapi import HTTPException

from repo.expense_repo import ExpenseRepo
from schema.expense_schema import ExpenseCreate


class ExpenseService:
    def __init__(self,repo:ExpenseRepo):
        self.repo=repo
    async def create_expense_service(
            self,
            data:ExpenseCreate
    ):
         new_expense=await self.repo.create_expense(data)
         return new_expense
    async def get_single_expense(self,expense_id:UUID):
        expense=await self.repo.get_expense_by_id(expense_id)
        if not expense:
            raise HTTPException(status_code=404,detail="expense not found")
        return expense
