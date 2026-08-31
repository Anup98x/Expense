from os import access
from fastapi.requests import Request
from fastapi import HTTPException, status
# Removed unused import PasswordHash
from core.security import SecurityService
from dependencies import repo_factory
from repo.auth_repo import AuthRepo
from schema.auth_schema import LoginUser, RegisterCreate
from fastapi.responses import JSONResponse

class AuthService:

    def __init__(self, authrepo: AuthRepo) -> None:
        self.authrepo = authrepo

    async def register_service(
        self,
        data: RegisterCreate
    ):

        # Check whether user already exists
        user = await self.authrepo.get_user_by_email(data.email)

        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )

        # Hash password before saving
        # SecurityService.hash_password expects a 'plain' keyword argument
        hashed_password = SecurityService().hash_password(plain=data.password1)

        # Create user
        await self.authrepo.create_user(
            data=data,
            hash_password=hashed_password
        )

        return {
            "message": "User registered successfully"
        }

    async def Login_service(
        self,
        data: LoginUser
    ):

        # 1. Find user by email
        user = await self.authrepo.get_user_by_email(
            data.email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # 2. Verify password
        is_correct = SecurityService().verify_hash_password(
            data.password,
            user.password
        )

        if not is_correct:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        token_data = {"user_id":str(user.id)}
        access = SecurityService().generate_access(token_data)
        refresh = SecurityService().generate_refresh(token_data)
        response = JSONResponse(
                     status_code=200,
                     content={"access":access,
                              }
                 )
        response.set_cookie(key="refresh",value=refresh,
                            httponly=True,secure=False,
                            samesite="lax",max_age=7*24*60*60*1000,)#max age allows the cookies to be stored on the browser for 7 days maximum
        print(access)
        return response
    async def get_user_service(self,access:str):
        payload=SecurityService().decode_token(access)
        user_id=payload["user_id"]
        user=await self.authrepo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        return user

    async def Refresh_Service(self,request:Request):
        token=request._cookies.get("refresh","")
        payload= SecurityService().decode_token(token)#calling decode token from security serivce since we have declared self at the top (class)
        user_id=payload.get("user_id",None)
        if not user_id:
            raise HTTPException(status_code=404,detail="User not found")
        user= await self.authrepo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404,detail="User not found")

        access_token= SecurityService().generate_access(payload)
        return access_token
