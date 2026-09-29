from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_incident_flow():
    # 1. Test root / health
    res = client.get("/api/")
    assert res.status_code == 200

    # 2. Create Incident
    payload = {
        "title": "Payment API 503 errors",
        "service": "payment-api",
        "severity": "critical",
        "environment": "production",
        "error_message": "HTTP 503 Service Unavailable",
        "symptoms": "Intermittent failures after deployment v2.8.1",
        "recent_deployment": "v2.8.1"
    }
    create_res = client.post("/api/incidents", json=payload)
    assert create_res.status_code == 200
    data = create_res.json()
    incident_id = data["incident_id"]
    assert incident_id.startswith("INC-")

    # 3. Investigate with Agent + Hindsight
    inv_res = client.post(f"/api/incidents/{incident_id}/investigate")
    assert inv_res.status_code == 200
    inv_data = inv_res.json()
    assert inv_data["incident_id"] == incident_id
    assert len(inv_data["historical_matches"]) > 0
    assert "INC-1024" in [m["memory_id"] for m in inv_data["historical_matches"]]
    assert len(inv_data["trace"]) > 0

    # 4. Resolve Incident
    resolve_res = client.post(f"/api/incidents/{incident_id}/resolve", json={
        "resolution": "Rolled back to v2.8.0",
        "resolution_steps": "1. deployment rollback 2. health check",
        "duration_minutes": 8
    })
    assert resolve_res.status_code == 200

    # 5. Generate Post-Mortem
    pm_res = client.post(f"/api/incidents/{incident_id}/postmortem")
    assert pm_res.status_code == 200
    pm_data = pm_res.json()
    assert pm_data["incident_id"] == incident_id
