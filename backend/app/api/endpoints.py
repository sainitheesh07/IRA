"""FastAPI Endpoints for Incident Response."""

from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.agents.incident_agent import agent
from app.schemas import (
    IncidentCreate,
    IncidentResponse,
    InvestigationResult,
    ResolveRequest,
    FeedbackRequest,
    PostMortemResponse,
)
from app.memory.hindsight_client import hindsight_client
import time

router = APIRouter()


@router.get("/")
def health():
    return {"status": "ok", "app": "OpsMemory AI"}


# GET all incidents
@router.get("/incidents")
def get_incidents():
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM incidents ORDER BY id DESC"
        ).fetchall()

        return [dict(row) for row in rows]


# CREATE incident
@router.post("/incidents", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate):
    with get_db() as db:
        incident_id = f"INC-{int(time.time())}"

        cursor = db.execute(
            """INSERT INTO incidents
            (incident_id, title, service, severity, environment,
             error_message, symptoms, recent_deployment, logs,
             additional_context)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                incident_id,
                incident.title,
                incident.service,
                incident.severity,
                incident.environment,
                incident.error_message,
                incident.symptoms,
                incident.recent_deployment,
                incident.logs,
                incident.additional_context,
            ),
        )

        incident_row = db.execute(
            "SELECT * FROM incidents WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

        return dict(incident_row)


# INVESTIGATE incident
@router.post(
    "/incidents/{incident_id}/investigate",
    response_model=InvestigationResult,
)
def investigate_incident(incident_id: str):
    with get_db() as db:
        inc = db.execute(
            "SELECT * FROM incidents WHERE incident_id = ?",
            (incident_id,),
        ).fetchone()

        if not inc:
            raise HTTPException(
                status_code=404,
                detail="Incident not found",
            )

        result = agent.investigate(
            incident_id=inc["incident_id"],
            service=inc["service"],
            error_message=inc["error_message"],
            symptoms=inc["symptoms"],
        )

        return result


# RESOLVE incident
@router.post("/incidents/{incident_id}/resolve")
def resolve_incident(
    incident_id: str,
    req: ResolveRequest,
):
    with get_db() as db:
        db.execute(
            """UPDATE incidents
               SET status = 'resolved',
                   resolution = ?,
                   resolution_steps = ?,
                   duration_minutes = ?
               WHERE incident_id = ?""",
            (
                req.resolution,
                req.resolution_steps,
                req.duration_minutes,
                incident_id,
            ),
        )

    return {"status": "success"}


# GENERATE postmortem
@router.post(
    "/incidents/{incident_id}/postmortem",
    response_model=PostMortemResponse,
)
def generate_postmortem(incident_id: str):
    return PostMortemResponse(
        incident_id=incident_id,
        summary="Payment gateway timeout due to configuration mismatch.",
        impact="Intermittent 503 errors affecting production users for 8 minutes.",
        timeline="14:02 Incident Start -> 14:05 Detection -> 14:10 Rollback -> 14:12 Verification",
        root_cause="Invalid upstream timeout threshold in config.",
        contributing_factors=[
            "Deployment v2.8.1",
            "Missing validation",
        ],
        resolution="Rollback to v2.8.0",
        prevention_steps=[
            "Add integration test for gateway timeout",
            "Mandatory config diff in pre-deploy",
        ],
        lessons_learned=[
            "Config validation is mandatory before rollout."
        ],
    )