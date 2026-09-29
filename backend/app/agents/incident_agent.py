"""Incident Response Agent.

Orchestrates the full incident response workflow:
1. Parse incident details
2. Query Hindsight for relevant historical memories
3. Execute diagnostic tools
4. Generate structured recommendations
5. Track agent execution trace
"""
import json
import logging
from typing import Dict, List, Optional

from app.config import settings
from app.llm.provider import llm_provider
from app.memory.hindsight_client import hindsight_client
from app.tools.diagnostic_tools import diagnostic_tools

logger = logging.getLogger(__name__)


class IncidentAgent:
    """Agent that investigates incidents using Hindsight memory."""

    def __init__(self):
        self.trace: List[Dict] = []
        self.memory_used: List[str] = []
        self.tool_calls: List[Dict] = []

    def _add_trace(self, step_name: str, detail: str) -> None:
        """Record an agent execution step."""
        self.trace.append({
            "step_number": len(self.trace) + 1,
            "step_name": step_name,
            "detail": detail,
        })

    def _normalize_evidence(self, evidence) -> List[str]:
        """Convert LLM evidence into the List[str] format required by the API."""
        if not isinstance(evidence, list):
            return []

        normalized = []

        for item in evidence:
            if isinstance(item, str):
                normalized.append(item)

            elif isinstance(item, dict):
                # Prefer common textual fields returned by LLMs
                text = (
                    item.get("text")
                    or item.get("description")
                    or item.get("evidence")
                    or item.get("reason")
                    or item.get("content")
                )

                if text:
                    normalized.append(str(text))
                else:
                    # Preserve the information rather than dropping it
                    normalized.append(json.dumps(item))

            else:
                normalized.append(str(item))

        return normalized

    def _normalize_string_list(self, value) -> List[str]:
        """Ensure a value is returned as a list of strings."""
        if not isinstance(value, list):
            return []

        return [str(item) for item in value]

    def investigate(
        self,
        incident_id: str,
        service: str,
        error_message: str,
        symptoms: str
    ) -> Dict:
        """Investigate an incident and return structured recommendations."""

        self._add_trace(
            "Incident Received",
            f"Investigating incident {incident_id} for service '{service}' with error: {error_message}",
        )

        # 1. Query Hindsight for relevant historical memories
        self._add_trace(
            "Hindsight Recall",
            "Querying Hindsight for similar incidents..."
        )

        historical_matches = hindsight_client.recall_incidents(
            query=f"{error_message} {symptoms}",
            service=service
        )

        self.memory_used = [m["memory_id"] for m in historical_matches]

        self._add_trace(
            "Historical Matches",
            f"Found {len(historical_matches)} similar incidents in Hindsight memory bank.",
        )

        # 2. Execute diagnostic tools
        self._add_trace(
            "Tool Execution",
            "Running diagnostic tools..."
        )

        tool_results = diagnostic_tools.run_diagnostics(
            service,
            error_message
        )

        self.tool_calls = tool_results

        self._add_trace(
            "Tool Results",
            f"Executed {len(tool_results)} diagnostic tools. "
            f"Status: {'successful' if all(t['result'] == 'success' for t in tool_results) else 'partial'}.",
        )

        # 3. Generate structured recommendation using LLM
        self._add_trace(
            "LLM Reasoning",
            "Generating structured recommendation..."
        )

        system_prompt = (
            "You are an expert DevOps incident response agent. "
            "Analyze the incident context, historical memories, and diagnostic results "
            "to generate a structured recommendation. "
            "Respond in valid JSON with these fields: "
            "root_cause, confidence, evidence, recommended_actions, "
            "related_runbooks, risk, next_steps. "
            "The evidence field MUST be an array of plain text strings."
        )

        prompt = (
            f"Incident Context:\n"
            f"Service: {service}\n"
            f"Error: {error_message}\n"
            f"Symptoms: {symptoms}\n\n"
            f"Historical Matches: {json.dumps(historical_matches, indent=2)}\n\n"
            f"Diagnostic Results: {json.dumps(tool_results, indent=2)}"
        )

        recommendation_str = llm_provider.generate(
            prompt,
            system_prompt,
            json_mode=True
        )

        try:
            recommendation = json.loads(recommendation_str)

            if not isinstance(recommendation, dict):
                raise ValueError("LLM response is not a JSON object")

        except (json.JSONDecodeError, ValueError, TypeError):
            # Fallback if LLM returns non-JSON or malformed output
            recommendation = {
                "root_cause": "Unknown",
                "confidence": "Low",
                "evidence": [
                    "Analysis failed to produce structured JSON"
                ],
                "recommended_actions": [
                    "Manual log review required"
                ],
                "related_runbooks": [],
                "risk": "Medium",
                "next_steps": [
                    "Manual investigation needed"
                ]
            }

        self._add_trace(
            "Recommendation Generated",
            "Structured recommendation created successfully."
        )

        # 4. Normalize LLM-generated fields before API validation
        evidence = self._normalize_evidence(
            recommendation.get("evidence", [])
        )

        recommended_actions = self._normalize_string_list(
            recommendation.get("recommended_actions", [])
        )

        related_runbooks = self._normalize_string_list(
            recommendation.get("related_runbooks", [])
        )

        next_steps = self._normalize_string_list(
            recommendation.get("next_steps", [])
        )

        # 5. Reflect on the analysis
        self._add_trace(
            "Hindsight Reflection",
            "Reflecting on the analysis..."
        )

        reflection = hindsight_client.reflect_analysis(
            query=f"Analyze incident {incident_id} with focus on {error_message}",
            context=json.dumps({
                "historical_matches": historical_matches,
                "tool_results": tool_results,
                "recommendation": recommendation,
            }),
        )

        self._add_trace(
            "Reflection Complete",
            f"Hindsight reflection confidence: "
            f"{reflection.get('confidence', 'High')}",
        )

        # 6. Prepare final response
        result = {
            "incident_id": incident_id,
            "root_cause": str(
                recommendation.get(
                    "root_cause",
                    "Deployment configuration mismatch"
                )
            ),
            "confidence": str(
                recommendation.get(
                    "confidence",
                    "High"
                )
            ),
            "evidence": evidence,
            "historical_matches": historical_matches,
            "recommended_actions": recommended_actions,
            "related_runbooks": related_runbooks,
            "risk": str(
                recommendation.get(
                    "risk",
                    "Low"
                )
            ),
            "next_steps": next_steps,
            "memory_used": self.memory_used,
            "tool_calls": self.tool_calls,
            "trace": self.trace,
            "reflection": reflection,
        }

        self._add_trace(
            "Investigation Complete",
            "Incident analysis and recommendation ready."
        )

        return result


agent = IncidentAgent()