





import uuid

from backend.core.db import Base

class Expense(Base):
    __tablename__="expenses"
    id:Mapped[uuidid.UUID]=mapped_column(UUID(as_uuid=True)),
