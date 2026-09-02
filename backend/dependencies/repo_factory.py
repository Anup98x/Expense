from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from repo.expense_repo import ExpenseRepo
from service.auth_service import AuthRepo
from core.db import get_db
from repo.auth_repo import AuthRepo

def get_auth_repo(db:Annotated[AsyncSession,Depends(get_db)]):
    return AuthRepo(db)
