"""SQLite database connection and schema management.

The database stores structured application state: incidents, runbooks,
post-mortems, feedback, and agent interaction traces. It is deliberately
separate from Hindsight, which holds the long-term agent memory and
learned context.
"""
import os
import sqlite3
from contextlib import contextmanager
from typing import Iterator, Optional

from app.config import settings


def _sqlite_path() -> str:
    """Resolve the SQLite file path from DATABASE_URL."""
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite:///"):
        path = db_url[len("sqlite:///"):]
    elif db_url.startswith("sqlite://"):
        path = db_url[len("sqlite://"):]
    else:
        path = "opsmemory.db"
    # Ensure parent directory exists for absolute paths
    if os.path.isabs(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


DB_PATH = _sqlite_path()


def get_connection() -> sqlite3.Connection:
    """Open a new SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def get_db() -> Iterator[sqlite3.Connection]:
    """Context manager yielding a SQLite connection."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


_SCHEMA = """
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    service TEXT NOT NULL,
    severity TEXT NOT NULL,
    environment TEXT NOT NULL,
    error_message TEXT,
    symptoms TEXT,
    recent_deployment TEXT,
    logs TEXT,
    additional_context TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    root_cause TEXT,
    resolution TEXT,
    resolution_steps TEXT,
    duration_minutes INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS incident_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    tool_name TEXT,
    tool_output TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (incident_id) REFERENCES incidents (incident_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS runbooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    conditions TEXT,
    steps TEXT NOT NULL,
    success_count INTEGER NOT NULL DEFAULT 0,
    failure_count INTEGER NOT NULL DEFAULT 0,
    last_used TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    rating TEXT NOT NULL,
    actual_resolution TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (incident_id) REFERENCES incidents (incident_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    detail TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (incident_id) REFERENCES incidents (incident_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    source TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents (service);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents (created_at);
CREATE INDEX IF NOT EXISTS idx_incident_events_incident ON incident_events (incident_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_incident ON feedbacks (incident_id);
"""


def init_db() -> None:
    """Create all tables if they do not exist."""
    conn = get_connection()
    try:
        conn.executescript(_SCHEMA)
        conn.commit()
    finally:
        conn.close()


def reset_db() -> None:
    """Drop and recreate all tables. Used by demo reset."""
    conn = get_connection()
    try:
        conn.executescript(
            "DROP TABLE IF EXISTS agent_interactions; "
            "DROP TABLE IF EXISTS feedbacks; "
            "DROP TABLE IF EXISTS runbooks; "
            "DROP TABLE IF EXISTS incident_events; "
            "DROP TABLE IF EXISTS incidents; "
            "DROP TABLE IF EXISTS team_preferences;"
        )
        conn.commit()
    finally:
        conn.close()
    init_db()


def health_check() -> bool:
    """Return True if the database is reachable and functional."""
    try:
        conn = get_connection()
        conn.execute("SELECT 1")
        conn.close()
        return True
    except Exception:
        return False


# Initialize tables on import so the app works out-of-the-box.
init_db()