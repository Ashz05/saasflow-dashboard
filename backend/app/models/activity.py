import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(120), nullable=False)
    user_email = Column(String(255), nullable=False)
    user_avatar = Column(Text, nullable=True)
    action = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=False)
    status = Column(String(20), nullable=False) # SUCCESS, FAILED, PENDING
    metadata_json = Column("metadata", JSON, nullable=True, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    workspace = relationship("Workspace", back_populates="activities")
