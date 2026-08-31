from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from sqlalchemy.orm import declarative_base

# from core.config import settings
from core.config import settings




# engine build
engine=create_async_engine(settings.DATABASE_URL,echo=True)
#sesssion handler
SessionHandler=async_sessionmaker(
    bind=engine, #it gives path to database
    expire_on_commit=True, #if database row changes then  also bepython object(table row value) changes
    autoflush=False#if python objects change then datbase row doesnt automatically changes we need to change ourself

)
Base=declarative_base() #Base uses the property of declarative base sql akchemy detects which class is model

async  def get_db():
   async with SessionHandler() as db:
       yield db
