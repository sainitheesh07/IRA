"""Pydantic schemas for API request/response payloads."""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Incident
# ---------------------------------------------------------------------------
class IncidentCreate(BaseModel):
    title: str
    service: str
    severity: str  # critical | high | medium | low
    environment: str
    error_message: Optional[str] = None
    symptoms: Optional[str] = None
    recent_deployment: Optional[str] = None
    logs: Optional[str] = None
    additional_context: Optional[str] = None


class IncidentResponse(BaseModel):
    id: int
    incident_id: str
    title: str
    service: str
    severity: str
    environment: str
    error_message: Optional[str] = None
    symptoms: Optional[str] = None
    recent_deployment: Optional[str] = None
    logs: Optional[str] = None
    additional_context: Optional[str] = None
    status: str
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    resolution_steps: Optional[str] = None
    duration_minutes: Optional[int] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Investigation
# ---------------------------------------------------------------------------
class MemoryMatch(BaseModel):
    memory_id: str
    memory_type: str
    source: str
    timestamp: str
    service: str
    relevance: float
    outcome: str
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    deployment: Optional[str] = None
    severity: Optional[str] = None
    duration_minutes: Optional[int] = None
    runbook: Optional[str] = None
    lessons_learned: Optional[str] = None


class ToolCall(BaseModel):
    tool_name: str
    arguments: dict
    result: str


class AgentStep(BaseModel):
    step_number: int
    step_name: str
    detail: str


class InvestigationResult(BaseModel):
    incident_id: str
    root_cause: str
    confidence: str
    evidence: List[str] = []
    historical_matches: List[MemoryMatch] = []
    recommended_actions: List[str] = []
    related_runbooks: List[str] = []
    risk: str
    next_steps: List[str] = []
    memory_used: List[str] = []
    tool_calls: List[ToolCall] = []
    trace: List[AgentStep] = []
    reflection: dict = {}
    generated_at: Optional[datetime] = None

# ---------------------------------------------------------------------------
# Resolution & Feedback
# ---------------------------------------------------------------------------
class ResolveRequest(BaseModel):
    resolution: str
    resolution_steps: Optional[str] = None
    duration_minutes: Optional[int] = None


class FeedbackRequest(BaseModel):
    rating: str  # helpful | partially_helpful | not_helpful
    actual_resolution: Optional[str] = None


class PostMortemRequest(BaseModel):
    incident_id: str


class PostMortemResponse(BaseModel):
    incident_id: str
    summary: str
    impact: str
    timeline: str
    root_cause: str
    contributing_factors: List[str] = []
    resolution: str
    prevention_steps: List[str] = []
    lessons_learned: List[str] = []


# ---------------------------------------------------------------------------
# Runbook
# ---------------------------------------------------------------------------
class RunbookResponse(BaseModel):
    id: int
    name: str
    service: str
    conditions: Optional[str] = None
    steps: str
    success_count: int
    failure_count: int
    last_used: Optional[str] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------
class AnalyticsResponse(BaseModel):
    total_incidents: int
    resolved_incidents: int
    open_incidents: int
    critical_incidents: int
    average_resolution_time_minutes: float
    memory_assisted_incidents: int
    memory_assistance_rate: float
    total_historical_matches: int
    successful_recommendations: int
    recurring_patterns: List[dict] = []
    service_impact: List[dict] = []
    severity_distribution: List[dict] = []
    trend: List[dict] = []


# ---------------------------------------------------------------------------
# Memory Explorer
# ---------------------------------------------------------------------------
class MemoryRecord(BaseModel):
    memory_id: str
    memory_type: str
    source: str
    timestamp: str
    service: str
    relevance: Optional[float] = None
    outcome: Optional[str] = None
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    deployment: Optional[str] = None
    severity: Optional[str] = None
    duration_minutes: Optional[int] = None
    runbook: Optional[str] = None
    lessons_learned: Optional[str] = None
    tags: List[str] = []


class MemorySearchResponse(BaseModel):
    query: str
    total: int
    memories: List[MemoryRecord]


# ---------------------------------------------------------------------------
# Learning Timeline
# ---------------------------------------------------------------------------
class LearningTimelineEvent(BaseModel):
    interaction: int
    label: str
    description: str
    memory_strength: int  # 0-100
    memory_used: bool


# ---------------------------------------------------------------------------
# Demo
# ---------------------------------------------------------------------------
class DemoScenarioResponse(BaseModel):
    id: str
    title: str
    service: str
    severity: str
    environment: str
    error_message: str
    symptoms: str
    recent_deployment: str


class DemoResetResponse(BaseModel):
    status: str
    message: str
    incidents_cleared: int
    memories_cleared: int