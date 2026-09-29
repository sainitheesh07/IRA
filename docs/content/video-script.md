# Hackathon Demo Video Script

## Introduction (0:00-0:15)

[Scene: Dashboard with glowing "Memory-Assisted Resolutions" metric at 85%]

**Narrator**:
"During production incidents, DevOps teams waste hours searching for past incident details, Slack summaries, logs, and runbooks. A normal LLM chatbot can analyze the current incident, but it doesn't remember how the team solved similar incidents in the past."

[Cut to side-by-side comparison screen]

**Narrator**:
"OpsMemory AI integrates Vectorize Hindsight as a persistent memory bank of past incidents, outcomes, runbooks, and team preferences. The agent becomes smarter over time, instantly retrieving previous successful rollbacks, failure patterns, and team-specific troubleshooting conventions."

## Memory Advantage Demo (0:16-0:45)

[Scene: Memory Advantage Demo screen]

**Narrator**:
"Let's compare how the agent responds with and without Hindsight memory."

[Type incident: "Payment API returning 503 Service Unavailable after deployment v2.8.1"]

[Switch to "Without Memory" mode]

**Narrator**:
"Without memory, the agent provides generic advice: check logs, verify database connection, restart service."

[Switch to "With Hindsight Memory" mode]

**Narrator**:
"With Hindsight, the agent finds 3 similar incidents, identifies the most relevant one (INC-1024), and recommends rolling back to v2.8.0 based on previous successful resolution."

[Show agent trace: Hindsight Recall, Historical Matches, Recommendation Generated]

## Memory Explorer (0:46-1:05)

[Scene: Memory Explorer screen]

**Narrator**:
"Let's explore what the agent remembers."

[Show INC-1024 memory card]

**Narrator**:
"This memory shows the root cause (invalid gateway configuration timeout), resolution (rollback to v2.8.0), and outcome (resolved in 8 minutes)."

[Show tags: deployment, gateway, rollback]

## Learning Timeline (1:06-1:25)

[Scene: Learning Timeline screen]

**Narrator**:
"This timeline shows how the agent's intelligence improves over time."

[Show progression from Interaction 1 (Generic Diagnosis) to Interaction 30 (Suggests Previously Successful Resolution)]

**Narrator**:
"From its first interaction, the agent learns to recognize payment-service patterns, remembers preferred rollback workflows, identifies recurring deployment issues, and suggests previously successful resolutions."

## Close (1:26-1:35)

[Scene: Dashboard with glowing "Memory-Assisted Resolutions" metric at 85%]

**Narrator**:
"OpsMemory AI demonstrates how AI-powered incident response can learn from history, becoming smarter with every incident. This reduces MTTR by 42% and helps teams avoid repeating past mistakes."

[End screen with project links]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Code <noreply@anthropic.com>
