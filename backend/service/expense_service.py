





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
