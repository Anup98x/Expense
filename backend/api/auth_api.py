

from os import access

from fastapi.requests import Request
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from dependencies.service_factory import get_auth_service
from service.auth_service import AuthService
from schema.auth_schema import LoginUser, RegisterCreate, UserResponse


auth_api=APIRouter(prefix="/auth",tags=["Auth Endpoints"])

@auth_api.post("/register")
async def register_user_endpoint(data:RegisterCreate,service:Annotated[AuthService,Depends(get_auth_service)]):
    user=await service.register_service(data)
    if user:
        return JSONResponse(status_code=200,content="User created")
@auth_api.post("/login")
async def login_user_endpoint(data:LoginUser,service:Annotated[AuthService,Depends(get_auth_service)]):
    return await service.Login_service(data)
oauth=OAuth2PasswordBearer(tokenUrl="/auth/login")
@auth_api.get("/me",response_model=UserResponse)
async def get_user_endpoint(token:Annotated[str,Depends(oauth
)],service:Annotated[AuthService,Depends(get_auth_service)]):
    user=await service.get_user_service(token)
    print(UserResponse.model_validate(user))
    return user
@auth_api.get("/refresh")
async def refresh_user_endpoint(request:Request,service:Annotated[AuthService,Depends(get_auth_service)]):
    access=await service.Refresh_Service(request)
    return JSONResponse(status_code=200,content={
        "access":access
    })
@auth_api.get("/logout")
async def logout_user_endpoint():
    response=JSONResponse(status_code=200,content="user logout successfully")
    response.delete_cookie("refresh")
    return response

@auth_api.get("expense")
async def expense_user_endpoint(data:access):
