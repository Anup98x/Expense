
from sqlalchemy.dialects.postgresql import UUID

import uuid

from sqlalchemy.orm import Mapped, mapped_column

from core.db import Base


class User(Base):#table for python
    __tablename__="Users"
    id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4())
    full_name:Mapped[str]
    email:Mapped[str]=mapped_column(unique=True)
    password:Mapped[str]
