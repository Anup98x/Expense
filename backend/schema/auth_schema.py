

from uuid import UUID

from fastapi import status
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator, model_validator


class RegisterCreate(BaseModel):
    full_name:str
    email:EmailStr
    password1:str
    password2:str
    @field_validator("full_name")
    def format_name(cls,value:str):
        return value.strip().title()
    @field_validator("email")
    def format_email(cls,value:str):
        return value.lower()
    @model_validator(mode="after")
    def format_password(self):
        if self.password1!=self.password2:
            raise ValueError("Password not matched")
        return self
class LoginUser(BaseModel):
    email:EmailStr
    password:str
    @field_validator("email")
    def format_email(cls,value:str):
        return value.lower()

class UserResponse(BaseModel):
    id:UUID
    full_name:str
    email:str
    model_config=ConfigDict(from_attributes=True) # to read the user row field from database this line is mandatory
