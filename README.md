# OpsMemory AI

An AI-powered Incident Response Agent for engineering/DevOps teams powered by **Vectorize Hindsight** persistent memory.

## Problem

When a production incident happens, engineers waste valuable time searching through previous incident reports, Slack summaries, logs, runbooks, and past fixes. A normal LLM chatbot can analyze the current incident, but it does not remember how the team solved similar incidents in the past.

## Solution

**OpsMemory AI** integrates **Vectorize Hindsight** as a persistent memory bank of past incidents, outcomes, runbooks, and team preferences. The agent becomes smarter over time, instantly retrieving previous successful rollbacks, failure patterns, and team-specific troubleshooting conventions.

---

## Architecture & Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Backend**: Python FastAPI, Pydantic, SQLite
- **Memory Engine**: Vectorize Hindsight API (`/v1/default/banks/{bank_id}/memories` retain, recall, reflect)
- **AI Engine**: Groq / OpenAI LLM abstraction layer with intelligent fallbacks

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Hackathon Demo Flow

1. **Dashboard**: View high-level DevOps KPIs and the hero metric: **"Memory-Assisted Resolutions"**.
2. **Memory Advantage Demo**: Compare **Without Hindsight** (vague, generic debugging advice) vs **With Hindsight** (precise historical incident matches, runbook guidance, and rollback recommendations).
3. **Memory Explorer**: Inspect raw Hindsight memory units, entity graphs, and confidence scores.
4. **Learning Timeline**: Visualize how the agent's memory strength increases over time.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Code <noreply@anthropic.com>
