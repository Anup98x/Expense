




from typing import Annotated

from fastapi import APIRouter, Depends

from dependencies.service_factory import get_expense_service
from schema.expense_schema import ExpenseCreate
from service.expense_service import ExpenseService


expense_api=APIRouter(prefix="/expense",tags=["expense endpoints"])
@expense_api.post("/")
async def create_expense_endpoint(data:ExpenseCreate,service:Annotated[ExpenseService,Depends(get_expense_service)]):
    await service.create_expense_service(data)
    return "Expense created successfully"
