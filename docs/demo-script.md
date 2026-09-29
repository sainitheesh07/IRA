# Hackathon Demo Script

## 60-Second Walkthrough

**1. Dashboard Overview**
- Show the **"Memory-Assisted Resolutions"** metric (85%)
- Highlight the **"Hindsight Coverage"** stat (12 services)
- Point out the **"Recurring Patterns"** section

**2. Memory Advantage Demo**
- Open the **"Memory Advantage"** tab
- Type: "Payment API returning 503 Service Unavailable after deployment v2.8.1"
- Click **"Without Memory"** mode → Show generic advice
- Switch to **"With Hindsight"** mode → Show:
  - 3 historical matches (INC-1024, INC-0978, INC-0942)
  - Recommended rollback to v2.8.0
  - Related runbook: "Payment API 503 Recovery"
  - Historical success rate: 85%

**3. Memory Explorer**
- Open the **"Memory Explorer"** tab
- Show the INC-1024 memory card with:
  - Root cause: "Invalid gateway configuration timeout"
  - Resolution: "Rolled back payment-api v2.8.1 to v2.8.0"
  - Outcome: "Resolved in 8 minutes"
  - Tags: deployment, gateway, rollback

**4. Learning Timeline**
- Open the **"Learning Timeline"** tab
- Show the progression from:
  - Interaction 1: Generic diagnosis
  - Interaction 10: Remembers preferred rollback workflow
  - Interaction 30: Suggests previously successful resolution

**5. Close with Impact**
- "This agent becomes smarter with every incident"
- "Memory-assisted resolutions reduce MTTR by 42%"
- "Hindsight integration makes this possible"

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Code <noreply@anthropic.com>
