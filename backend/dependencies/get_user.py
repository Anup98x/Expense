
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, Request, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from core.security import SecurityService
from model.user import User


async def get_user(
    request: Request,
    # token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="/login"))],

    db: Annotated[AsyncSession, Depends(get_db)],
):
    token=request.cookies.get("refresh",None)
    if not token:
        raise HTTPException(status_code=401,detail="Token not found")
    payload = SecurityService().decode_token(token)
    user_id=payload.get("user_id",None)
    if not user_id:
        raise HTTPException(status_code=400,detail="User not found")
    user=(await db.execute(select(User).where(User.id==UUID(user_id)))).scalar_one_or_none()
    if not user:
         raise HTTPException(status_code=400,detail="User not found")
    return user
