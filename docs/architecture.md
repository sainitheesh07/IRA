# OpsMemory AI Architecture

## Overview
OpsMemory AI is a professional AI-driven incident response agent that leverages **Vectorize Hindsight** as its core long-term memory engine. 

## Component Diagram
```mermaid
graph TD
    User[DevOps Engineer] -->|1. Submit Incident| Frontend[Next.js React Client]
    Frontend -->|2. POST /api/incidents| Backend[FastAPI Server]
    Backend -->|3. Query SQLite State| SQLite[(SQLite Database)]
    Backend -->|4. Trigger Investigation| Agent[Incident Response Agent]
    
    subgraph AI & Memory Layer
        Agent -->|5. Recall / Reflect| Hindsight[Vectorize Hindsight Memory Bank]
        Agent -->|6. Run Diagnostics| Tools[Diagnostic Tools]
        Agent -->|7. Analyze Context & Matches| LLM[LLM Provider - Groq/OpenAI]
    end
    
    LLM -->|8. Generate Recommendation| Agent
    Agent -->|9. Structured Result| Backend
    Backend -->|10. Live Trace & Resolution| Frontend
    Frontend -->|11. Approved Outcome & Feedback| Backend
    Backend -->|12. Store Resolution| Hindsight
```

## Core Workflows

### 1. Incident Creation & Analysis
- When an incident is logged, the backend creates a structured ticket in SQLite.
- The Agent queries Hindsight with the incident symptoms and error messages.
- Hindsight searches across **semantic, keyword, entity-graph, and temporal dimensions** to retrieve previous matching outages.

### 2. Feedback & Memory Consolidation
- When an engineer confirms a recommendation as helpful, the successful recovery steps are written back to Hindsight using the `/v1/default/banks/{bank_id}/memories` endpoint.
- Hindsight automatically consolidates these raw experience facts into high-level operational rules (Observations) over time.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Code <noreply@anthropic.com>
