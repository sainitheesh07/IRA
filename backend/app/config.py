"""Centralized configuration for OpsMemory AI backend."""
import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Environment-driven configuration. All secrets come from .env."""

    # --- Hindsight Memory ---
    HINDSIGHT_API_KEY: Optional[str] = os.getenv("HINDSIGHT_API_KEY")
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "https://hindsight.vectorize.io")
    HINDSIGHT_MEMORY_BANK: str = os.getenv("HINDSIGHT_MEMORY_BANK", "opsmemory-incident-history")
    HINDSIGHT_ENABLED: bool = os.getenv("HINDSIGHT_ENABLED", "true").lower() == "true"

    # --- LLM ---
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq").lower()
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
    LLM_TIMEOUT_SECONDS: int = int(os.getenv("LLM_TIMEOUT_SECONDS", "20"))

    # --- Database ---
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./opsmemory.db")

    # --- Application ---
    APP_NAME: str = os.getenv("APP_NAME", "OpsMemory AI")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    DEFAULT_TEAM_PREFERENCES: dict = {
        "preferred_rollback_policy": "rollback_before_restart",
        "preferred_restart_policy": "restart_after_rollback_validation",
        "escalation_on_severity": "critical",
        "environment_specific_conventions": {
            "production": "rollback_first",
            "staging": "diagnose_first",
        },
    }


settings = Settings()