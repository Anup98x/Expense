




from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from dependencies.service_factory import get_expense_service
from schema.expense_schema import ExpenseCreate, SingleExpense
from service.expense_service import ExpenseService


expense_api=APIRouter(prefix="/expense",tags=["expense endpoints"])
@expense_api.post("/")
async def create_expense_endpoint(data:ExpenseCreate,service:Annotated[ExpenseService,Depends(get_expense_service)]):
    await service.create_expense_service(data)
    return "Expense created successfully"
@expense_api.get("/{expense_id}",response_model=SingleExpense) #expense_id is the path parameter and response model is used to validate row
async def get_single_expense_endpoint(expense_id:UUID,service:Annotated[ExpenseService,Depends(get_expense_service)]):
    expenses=await service.get_single_expense(expense_id)
    return expenses
