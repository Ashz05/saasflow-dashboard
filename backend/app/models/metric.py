import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.db.base import Base

class Metric(Base):
    __tablename__ = "kpi_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    metric_key = Column(String(50), nullable=False) # total_revenue, active_users, conversion_rate, avg_response_time
    value_numeric = Column(Numeric(14, 2), nullable=False)
    value_display = Column(String(50), nullable=False) # $48,250, 2,847, 3.24%, 245ms
    delta_percentage = Column(Numeric(6, 2), nullable=False) # +12.5, +8.3, -1.2, +4.6
    delta_direction = Column(String(10), nullable=False, default="positive") # positive, negative, neutral
    timeframe = Column(String(20), nullable=False, default="30d") # 7d, 30d, 90d
    recorded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    workspace = relationship("Workspace", back_populates="metrics")
