import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app as fastapi_app
from app.db.base import Base
from app.db.session import get_db
from app.models.workspace import Workspace
from sqlalchemy.pool import StaticPool
from app.models.user import User
from app.models.metric import Metric
from app.models.activity import ActivityLog

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def test_db_session():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    
    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def client(test_db_session):
    async def override_get_db():
        yield test_db_session

    fastapi_app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=fastapi_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    fastapi_app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_register_and_login_flow(client):
    # 1. Register
    reg_payload = {
        "email": "testuser@saasflow.co",
        "password": "supersecurepassword123",
        "fullName": "Test User"
    }
    response = await client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testuser@saasflow.co"
    assert data["user"]["workspace"]["name"] == "Vortex Workspace"

    # 2. Duplicate Register
    dup_res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 3. Login with wrong password
    bad_login = await client.post("/api/v1/auth/login", json={
        "email": "testuser@saasflow.co",
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 401

    # 4. Login with correct password
    good_login = await client.post("/api/v1/auth/login", json={
        "email": "testuser@saasflow.co",
        "password": "supersecurepassword123"
    })
    assert good_login.status_code == 200
    token = good_login.json()["access_token"]
    refresh_token = good_login.json()["refresh_token"]
    assert refresh_token is not None

    # 5. Access protected /me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testuser@saasflow.co"

    # 5b. Refresh token cannot be used directly as access bearer token
    refresh_as_bearer = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {refresh_token}"})
    assert refresh_as_bearer.status_code == 401

    # 5c. Silent refresh rotation succeeds
    refresh_res = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    new_data = refresh_res.json()
    assert "access_token" in new_data
    assert "refresh_token" in new_data
    new_token = new_data["access_token"]

    # Old refresh token now revoked
    old_refresh_res = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert old_refresh_res.status_code == 401

    # New access token works
    new_me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {new_token}"})
    assert new_me.status_code == 200

    # 5d. Password complexity validation (too short)
    short_pw_res = await client.post("/api/v1/auth/register", json={
        "email": "short@saasflow.co",
        "password": "123",
        "fullName": "Short"
    })
    assert short_pw_res.status_code == 422

    # 5e. Logout revokes sessions
    logout_res = await client.post("/api/v1/auth/logout", headers={"Authorization": f"Bearer {new_token}"})
    assert logout_res.status_code == 200

    # 5f. OAuth2 password form authentication via /token
    oauth_res = await client.post("/api/v1/auth/token", data={
        "username": "testuser@saasflow.co",
        "password": "supersecurepassword123"
    })
    assert oauth_res.status_code == 200
    assert "access_token" in oauth_res.json()
    assert oauth_res.json()["token_type"] == "bearer"

    # 6. Access /me without token
    unauth_me = await client.get("/api/v1/auth/me")
    assert unauth_me.status_code == 401

@pytest.mark.asyncio
async def test_dashboard_endpoints(client):
    # Register user first to get token
    reg_payload = {
        "email": "alex.d@saasflow.co",
        "password": "supersecurepassword123",
        "fullName": "Alex Devon"
    }
    reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Unauthenticated stats fails
    unauth_stats = await client.get("/api/v1/dashboard/stats")
    assert unauth_stats.status_code == 401

    # 2. Authenticated stats succeeds
    stats_res = await client.get("/api/v1/dashboard/stats?timeframe=30d", headers=headers)
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert len(stats_data["metrics"]) == 4
    keys = [m["key"] for m in stats_data["metrics"]]
    assert "total_revenue" in keys
    assert "active_users" in keys
    assert "conversion_rate" in keys
    assert "avg_response_time" in keys

    # 3. Charts succeeds
    charts_res = await client.get("/api/v1/dashboard/charts?timeframe=30d", headers=headers)
    assert charts_res.status_code == 200
    charts_data = charts_res.json()
    assert len(charts_data["engagement"]) > 0
    assert len(charts_data["trafficChannels"]) == 4
    assert charts_data["trafficTotal"].endswith("k")

    # 4. Activities succeeds
    activities_res = await client.get("/api/v1/dashboard/activities?page=1&limit=4", headers=headers)
    assert activities_res.status_code == 200
    act_data = activities_res.json()
    assert "data" in act_data
    assert "pagination" in act_data
    assert act_data["pagination"]["currentPage"] == 1
    assert act_data["pagination"]["limit"] == 4
