from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class KpiMetricItem(BaseModel):
    key: str
    title: str
    value: str
    delta: str
    deltaDirection: str # positive, negative, neutral
    icon: str

class StatsResponse(BaseModel):
    timeframe: str
    metrics: List[KpiMetricItem]

class EngagementDataPoint(BaseModel):
    date: str
    sessions: int

class TrafficChannelItem(BaseModel):
    name: str
    percentage: int
    color: str

class ChartsResponse(BaseModel):
    timeframe: str
    engagement: List[EngagementDataPoint]
    trafficTotal: str
    trafficChannels: List[TrafficChannelItem]

class ActivityUser(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None

class ActivityItem(BaseModel):
    id: str
    user: ActivityUser
    action: str
    ipAddress: str
    status: str # SUCCESS, FAILED, PENDING
    timestamp: str
    createdAt: str

class PaginationMeta(BaseModel):
    currentPage: int
    limit: int
    totalRecords: int
    totalPages: int
    hasNextPage: bool
    hasPrevPage: bool

class PaginatedActivitiesResponse(BaseModel):
    data: List[ActivityItem]
    pagination: PaginationMeta
