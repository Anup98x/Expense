






from typing import Annotated

from fastapi import Depends

from dependencies.repo_factory import get_auth_repo, get_expense_repo
from repo.auth_repo import AuthRepo
from repo.expense_repo import ExpenseRepo
from service.auth_service import AuthService
from service.expense_service import ExpenseService



def get_auth_service(auth_repo:Annotated[AuthRepo,Depends(get_auth_repo)]):
    return AuthService(authrepo=auth_repo)
def get_expense_service(expense_repo:Annotated[ExpenseRepo,Depends(get_expense_repo)]):
    return ExpenseService(expense_repo)
