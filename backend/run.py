"""Run script for OpsMemory AI backend."""
import os
import sys
from app.main import app

if __name__ == "__main__":
    os.environ["UVICORN_RUN_ASYNC"] = "true"
    os.environ["UVICORN_LOADER"] = "uvicorn.load"
    from uvicorn import run
    run(
        app="app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
    )
