from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    role: str
    avatarUrl: Optional[str] = None
    workspace: Optional[WorkspaceResponse] = None

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    type: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    fullName: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    rememberMe: Optional[bool] = False

