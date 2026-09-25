from datetime import datetime, timezone, timedelta
import hashlib
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.core.config import settings
from app.models.user import User, RefreshToken
from app.models.workspace import Workspace
from app.models.activity import ActivityLog
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    Token,
    UserResponse,
    WorkspaceResponse,
    RefreshTokenRequest,
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    if payload.get("type") != "access":
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id).options(selectinload(User.workspace))
    result = await db.execute(stmt)
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, request: Request, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Create default workspace
    workspace_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    workspace = Workspace(
        id=workspace_id,
        name="Vortex Workspace",
        slug=f"vortex-{uuid.uuid4().hex[:6]}"
    )
    db.add(workspace)

    # Create user
    user = User(
        id=user_id,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.fullName,
        workspace_id=workspace_id,
        role="owner"
    )
    db.add(user)

    # Issue tokens
    access_token = create_access_token(subject=user_id)
    refresh_token = create_refresh_token(subject=user_id)
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh = RefreshToken(
        id=str(uuid.uuid4()),
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        ip_address=request.client.host if request.client else "127.0.0.1"
    )
    db.add(db_refresh)

    # Record Activity Log
    client_ip = request.client.host if request.client else "127.0.0.1"
    activity = ActivityLog(
        id=str(uuid.uuid4()),
        workspace_id=workspace_id,
        user_id=user_id,
        user_name=user.full_name,
        user_email=user.email,
        user_avatar=user.avatar_url,
        action="User registered account",
        ip_address=client_ip,
        status="success"
    )
    db.add(activity)

    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        role=user.role,
        avatarUrl=user.avatar_url,
        workspace=WorkspaceResponse(id=workspace.id, name=workspace.name, slug=workspace.slug)
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        user=user_resp
    )

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == user_in.email).options(selectinload(User.workspace))
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    client_ip = request.client.host if request.client else "127.0.0.1"
    db_refresh = RefreshToken(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        ip_address=client_ip
    )
    db.add(db_refresh)

    # Record Activity Log
    if user.workspace_id:
        activity = ActivityLog(
            id=str(uuid.uuid4()),
            workspace_id=user.workspace_id,
            user_id=user.id,
            user_name=user.full_name,
            user_email=user.email,
            user_avatar=user.avatar_url,
            action="User logged in",
            ip_address=client_ip,
            status="success"
        )
        db.add(activity)

    await db.commit()

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        role=user.role,
        avatarUrl=user.avatar_url,
        workspace=WorkspaceResponse(
            id=user.workspace.id,
            name=user.workspace.name,
            slug=user.workspace.slug
        ) if user.workspace else None
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        user=user_resp
    )

@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(
    refresh_in: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(refresh_in.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    token_hash = hashlib.sha256(refresh_in.refresh_token.encode()).hexdigest()

    stmt = select(RefreshToken).where(
        RefreshToken.token_hash == token_hash,
        RefreshToken.user_id == user_id,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    db_token = result.scalars().first()
    now = datetime.now(timezone.utc)

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is expired or revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validate expiration
    expires_at = db_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch user
    user_stmt = select(User).where(User.id == user_id).options(selectinload(User.workspace))
    user_result = await db.execute(user_stmt)
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Rotate refresh token
    db_token.revoked_at = now
    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    new_token_hash = hashlib.sha256(new_refresh_token.encode()).hexdigest()
    client_ip = request.client.host if request.client else "127.0.0.1"

    new_db_token = RefreshToken(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token_hash=new_token_hash,
        expires_at=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        ip_address=client_ip
    )
    db.add(new_db_token)
    await db.commit()

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        role=user.role,
        avatarUrl=user.avatar_url,
        workspace=WorkspaceResponse(
            id=user.workspace.id,
            name=user.workspace.name,
            slug=user.workspace.slug
        ) if user.workspace else None
    )

    return Token(
        access_token=new_access_token,
        token_type="bearer",
        refresh_token=new_refresh_token,
        user=user_resp
    )

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(RefreshToken).where(
        RefreshToken.user_id == current_user.id,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    active_tokens = result.scalars().all()
    now = datetime.now(timezone.utc)
    for t in active_tokens:
        t.revoked_at = now
    await db.commit()
    return {"message": "Logged out successfully"}

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.email == form_data.username).options(selectinload(User.workspace))
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        fullName=current_user.full_name,
        role=current_user.role,
        avatarUrl=current_user.avatar_url,
        workspace=WorkspaceResponse(
            id=current_user.workspace.id,
            name=current_user.workspace.name,
            slug=current_user.workspace.slug
        ) if current_user.workspace else None
    )

