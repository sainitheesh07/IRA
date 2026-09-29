import { NextApiRequest, NextApiResponse } from "next";
import { InvestigationResult } from "@/app/schemas";

// Mock API endpoint for investigation
// In a real app, this would call the FastAPI backend

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvestigationResult | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { incidentId, service, errorMessage, symptoms } = req.body;

  // Simulate investigation with Hindsight memory
  const result: InvestigationResult = {
    incident_id: incidentId,
    root_cause: "Deployment configuration mismatch",
    confidence: "High",
    evidence: [
      "Error logs show upstream request timed out after 3000ms",
      "Incident correlates with recent deployment v2.8.1",
      "Matching historical incident INC-1024 shared identical symptoms and fix",
    ],
    historical_matches: [
      {
        memory_id: "INC-1024",
        memory_type: "experience",
        source: "Hindsight Knowledge Graph",
        timestamp: "2026-09-21 14:02",
        service: "payment-api",
        relevance: 0.96,
        outcome: "Resolved in 8 minutes",
        root_cause: "Invalid gateway configuration timeout after deployment",
        resolution: "Rolled back payment-api v2.8.1 to v2.8.0 and verified webhook endpoints",
        deployment: "v2.8.1",
        severity: "Critical",
        duration_minutes: 8,
        runbook: "Payment API 503 Recovery",
        lessons_learned: "Upstream gateway timeouts require immediate config rollback rather than connection pool restart.",
      },
    ],
    recommended_actions: [
      "Roll back deployment to stable version v2.8.0",
      "Validate upstream gateway timeout threshold configuration",
      "Verify service health endpoints",
    ],
    related_runbooks: [
      "Payment API 503 Recovery",
      "Deployment Rollback Runbook",
    ],
    risk: "Low (Rollback verified in previous incidents)",
    next_steps: [
      "1. Confirm team approval for rollback",
      "2. Execute rollback via deployment manager",
      "3. Monitor 503 error rates on Prometheus dashboard",
    ],
    memory_used: ["INC-1024"],
    tool_calls: [
      {
        tool_name: "check_service_health",
        arguments: { service: "payment-api" },
        result: "success: Service reachable, 503 errors detected in last 5 minutes",
      },
      {
        tool_name: "fetch_recent_logs",
        arguments: { service: "payment-api", limit: 10 },
        result: "success: Found GatewayTimeoutException and upstream request failures",
      },
      {
        tool_name: "get_recent_deployments",
        arguments: { service: "payment-api" },
        result: "success: Latest deployment v2.8.1 (14 minutes ago)",
      },
    ],
    trace: [
      {
        step_number: 1,
        step_name: "Incident Received",
        detail: `Investigating incident ${incidentId} for service 'payment-api' with error: HTTP 503 Service Unavailable`,
      },
      {
        step_number: 2,
        step_name: "Hindsight Recall",
        detail: "Querying Hindsight for similar incidents...",
      },
      {
        step_number: 3,
        step_name: "Historical Matches",
        detail: "Found 1 similar incident in Hindsight memory bank.",
      },
      {
        step_number: 4,
        step_name: "Tool Execution",
        detail: "Running diagnostic tools...",
      },
      {
        step_number: 5,
        step_name: "Tool Results",
        detail: "Executed 3 diagnostic tools. Status: successful.",
      },
      {
        step_number: 6,
        step_name: "LLM Reasoning",
        detail: "Generating structured recommendation...",
      },
      {
        step_number: 7,
        step_name: "Recommendation Generated",
        detail: "Structured recommendation created successfully.",
      },
      {
        step_number: 8,
        step_name: "Hindsight Reflection",
        detail: "Reflecting on the analysis...",
      },
      {
        step_number: 9,
        step_name: "Reflection Complete",
        detail: "Hindsight reflection confidence: High (96%)",
      },
      {
        step_number: 10,
        step_name: "Investigation Complete",
        detail: "Incident analysis and recommendation ready.",
      },
    ],
    reflection: {
      text: "Based on Hindsight reflection, this matches previous deployment failure patterns.",
      based_on: ["INC-1024"],
      confidence: "High (96%)",
    },
    generated_at: new Date().toISOString(),
  };

  res.status(200).json(result);
}
