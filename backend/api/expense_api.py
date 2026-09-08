




from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from dependencies.get_user import get_user
from dependencies.service_factory import get_expense_service
from model.user import User
from schema.expense_schema import ExpenseCreate, SingleExpense
from service.expense_service import ExpenseService


expense_api=APIRouter(prefix="/expense",tags=["expense endpoints"])
@expense_api.post("/")
async def create_expense_endpoint(data:ExpenseCreate,service:Annotated[ExpenseService,Depends(get_expense_service)],user:Annotated[User,Depends(get_user)]):
    await service.create_expense_service(data,user)
    return "Expense created successfully"
@expense_api.get("/{expense_id}",response_model=SingleExpense) #expense_id is the path parameter and response model is used to validate row
async def get_single_expense_endpoint(expense_id:UUID,service:Annotated[ExpenseService,Depends(get_expense_service)],user:Annotated[User,Depends(get_user)]
    ):
    expenses=await service.get_single_expense(expense_id) #we are doing this bcz when we want to save the expense we create on frontend also in the backend using expense id as primary key so thats why

    return expenses

@expense_api.get("/",response_model=list[SingleExpense]) #list helps to give list of the rowss
async def get_expense_read_endpoints(service:Annotated[ExpenseService,Depends(get_expense_service)],user:Annotated[User,Depends(get_user)]):
    expenses=await service.get_expenses(user)
    return expenses
