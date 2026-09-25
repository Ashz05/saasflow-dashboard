import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from app.db.session import async_session_maker, engine
from app.db.base import Base
from app.models.workspace import Workspace
from app.models.user import User
from app.models.metric import Metric
from app.models.activity import ActivityLog
from app.core.security import get_password_hash

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        # Check if workspace already exists
        from sqlalchemy.future import select
        stmt = select(Workspace).where(Workspace.slug == "vortex-workspace")
        res = await db.execute(stmt)
        workspace = res.scalars().first()

        if not workspace:
            workspace = Workspace(
                name="Vortex Workspace",
                slug="vortex-workspace"
            )
            db.add(workspace)
            await db.flush()

        # Seed User
        stmt = select(User).where(User.email == "alex.d@saasflow.co")
        res = await db.execute(stmt)
        user = res.scalars().first()

        if not user:
            user = User(
                workspace_id=workspace.id,
                email="alex.d@saasflow.co",
                password_hash=get_password_hash("supersecurepassword123"),
                full_name="Alex Devon",
                role="owner",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
            )
            db.add(user)
            await db.flush()

        # Seed KPI Metrics
        stmt = select(Metric).where(Metric.workspace_id == workspace.id)
        res = await db.execute(stmt)
        if not res.scalars().first():
            metrics = [
                # 30d
                Metric(workspace_id=workspace.id, metric_key="total_revenue", value_numeric=48250.0, value_display="$48,250", delta_percentage=12.5, delta_direction="positive", timeframe="30d"),
                Metric(workspace_id=workspace.id, metric_key="active_users", value_numeric=2847.0, value_display="2,847", delta_percentage=8.3, delta_direction="positive", timeframe="30d"),
                Metric(workspace_id=workspace.id, metric_key="conversion_rate", value_numeric=3.24, value_display="3.24%", delta_percentage=-1.2, delta_direction="negative", timeframe="30d"),
                Metric(workspace_id=workspace.id, metric_key="avg_response_time", value_numeric=245.0, value_display="245ms", delta_percentage=4.6, delta_direction="positive", timeframe="30d"),
                # 7d
                Metric(workspace_id=workspace.id, metric_key="total_revenue", value_numeric=14200.0, value_display="$14,200", delta_percentage=5.4, delta_direction="positive", timeframe="7d"),
                Metric(workspace_id=workspace.id, metric_key="active_users", value_numeric=1940.0, value_display="1,940", delta_percentage=3.1, delta_direction="positive", timeframe="7d"),
                Metric(workspace_id=workspace.id, metric_key="conversion_rate", value_numeric=3.45, value_display="3.45%", delta_percentage=0.8, delta_direction="positive", timeframe="7d"),
                Metric(workspace_id=workspace.id, metric_key="avg_response_time", value_numeric=238.0, value_display="238ms", delta_percentage=2.1, delta_direction="positive", timeframe="7d"),
                # 90d
                Metric(workspace_id=workspace.id, metric_key="total_revenue", value_numeric=128400.0, value_display="$128,400", delta_percentage=22.4, delta_direction="positive", timeframe="90d"),
                Metric(workspace_id=workspace.id, metric_key="active_users", value_numeric=8450.0, value_display="8,450", delta_percentage=18.6, delta_direction="positive", timeframe="90d"),
                Metric(workspace_id=workspace.id, metric_key="conversion_rate", value_numeric=3.12, value_display="3.12%", delta_percentage=-0.5, delta_direction="negative", timeframe="90d"),
                Metric(workspace_id=workspace.id, metric_key="avg_response_time", value_numeric=255.0, value_display="255ms", delta_percentage=6.2, delta_direction="positive", timeframe="90d"),
            ]
            db.add_all(metrics)

        # Seed 48 Activity Logs
        stmt = select(ActivityLog).where(ActivityLog.workspace_id == workspace.id)
        res = await db.execute(stmt)
        if not res.scalars().first():
            now = datetime.now(timezone.utc)
            base_activities = [
                ("Marcus Aurelius", "marcus@rome.net", "Upgraded subscription", "192.168.1.45", "SUCCESS", now - timedelta(minutes=2)),
                ("Helena Carter", "helena@sky.io", "API key generated", "10.0.42.12", "SUCCESS", now - timedelta(minutes=14)),
                ("Devon Lane", "devon@pulse.tech", "Failed payment attempt", "172.56.9.110", "FAILED", now - timedelta(hours=1)),
                ("Siddharth Sen", "sid@global.co", "Workspace integration requested", "192.168.4.11", "PENDING", now - timedelta(hours=3)),
            ]

            actions_pool = [
                ("User invite sent", "SUCCESS"),
                ("Password reset requested", "SUCCESS"),
                ("Webhook endpoint updated", "SUCCESS"),
                ("Exported audit report", "SUCCESS"),
                ("Failed login attempt (3x)", "FAILED"),
                ("Subscription tier downgraded", "PENDING"),
                ("Custom domain DNS verified", "SUCCESS"),
                ("API rate limit exceeded", "FAILED"),
            ]
            names_pool = [
                ("Emma Watson", "emma@flow.dev"),
                ("Liam Neeson", "liam@taken.io"),
                ("Sophia Loren", "sophia@cinema.it"),
                ("Noah Centineo", "noah@actors.com"),
                ("Olivia Rodrigo", "olivia@music.org"),
                ("Lucas Scott", "lucas@treehill.com"),
                ("Ava Max", "ava@pop.co"),
            ]

            logs = []
            for name, email, action, ip, status, ts in base_activities:
                logs.append(ActivityLog(
                    workspace_id=workspace.id,
                    user_name=name,
                    user_email=email,
                    action=action,
                    ip_address=ip,
                    status=status,
                    created_at=ts
                ))

            for i in range(44):
                n_idx = i % len(names_pool)
                a_idx = i % len(actions_pool)
                name, email = names_pool[n_idx]
                action, status = actions_pool[a_idx]
                ts = now - timedelta(hours=4 + i * 2)
                logs.append(ActivityLog(
                    workspace_id=workspace.id,
                    user_name=name,
                    user_email=email,
                    action=action,
                    ip_address=f"192.168.{(i*7)%250}.{(i*13)%250}",
                    status=status,
                    created_at=ts
                ))

            db.add_all(logs)

        await db.commit()
        print("Database seeded successfully with workspace, user, KPIs, and 48 activity logs!")

if __name__ == "__main__":
    asyncio.run(seed_data())
