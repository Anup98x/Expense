
from sqlalchemy.ext.asyncio import AsyncSession


class ExpenseRepo:
    def __init__(self, session: AsyncSession):
        self.session = session
