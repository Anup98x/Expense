from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from schema.auth_schema import RegisterCreate
from model.user import User
from core.security import SecurityService

#base class
class AuthRepo:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self,email:str):
        user=(await self.db.execute(select(User).where(User.email==email))).scalar_one_or_none()
        return user

    async def create_user(self,data:RegisterCreate,hash_password:str):

        user=User(
            email=data.email,
            full_name=data.full_name,
            password=SecurityService().hash.hash(data.password1)
        )
        self.db.add(user)
        await self.db.commit()
        return user
    async def get_user_by_id(self,id:str):
            user=(await self.db.execute(select(User).where(User.id==UUID(id)))).scalar_one_or_none()
            return user
