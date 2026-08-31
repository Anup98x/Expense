from datetime import datetime, timedelta
from os import access
from fastapi import HTTPException
from jose import JWTError
import jwt
from pwdlib import PasswordHash
from core.config import settings
from jwt.exceptions import PyJWTError


class SecurityService:
    def __init__(self) -> None:
        self.hash=PasswordHash.recommended() #for hashing library

    # To hash the password
    def hash_password(self,plain:str):
        return self.hash.hash(plain)

    # To verify the password
    def verify_hash_password(self,plain:str,hash:str):
        return self.hash.verify(plain,hash)

    # To generate the access token for auth_service
    def generate_access(self,token_data:dict):
        payload=token_data.copy()
        payload["exp"]=datetime.now()+timedelta(minutes=15)
        access=jwt.encode(payload=token_data,key=settings.SECRET_KEY,algorithm="HS256")
        return access
    def generate_refresh(self,token_data:dict):
            payload=token_data.copy() # we are using token data on two functions so we are copying so that it cant be modified keeping it as original also called  dict as mutuable(once changed for all also changed)
            payload["exp"]=datetime.now()+timedelta(days=7)
            access=jwt.encode(payload=token_data,key=settings.SECRET_KEY,algorithm="HS256")

            return access
    def decode_token(self,token:str):
         try:
            print(token)
            payload=jwt.decode(token,algorithms="HS256",key=settings.SECRET_KEY)

            return payload


         except PyJWTError:
              raise HTTPException(status_code=401
                                  ,detail="Invalid token")
