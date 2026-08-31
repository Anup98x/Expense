import fastapi
from fastapi.middleware.cors import CORSMiddleware
from api.auth_api import auth_api
from fastapi import FastAPI
app=FastAPI()
app.include_router(auth_api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # List of allowed origins
    allow_credentials=True,           # Allow cookies/auth headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],              # Allow all headers
)
