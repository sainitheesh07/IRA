export interface MemoryMatch {
  memory_id: string;
  memory_type: string;
  source: string;
  timestamp: string;
  service: string;
  relevance: number;
  outcome: string;
  root_cause?: string;
  resolution?: string;
  deployment?: string;
  severity?: string;
  duration_minutes?: number;
  runbook?: string;
  lessons_learned?: string;
}

export interface ToolCall {
  tool_name: string;
  arguments: Record<string, unknown>;
  result: string;
}

export interface AgentStep {
  step_number: number;
  step_name: string;
  detail: string;
}

export interface InvestigationResult {
  incident_id: string;
  root_cause: string;
  confidence: string;
  evidence: string[];
  historical_matches: MemoryMatch[];
  recommended_actions: string[];
  related_runbooks: string[];
  risk: string;
  next_steps: string[];
  memory_used: string[];
  tool_calls: ToolCall[];
  trace: AgentStep[];
  reflection: Record<string, unknown>;
  generated_at?: string;
}
