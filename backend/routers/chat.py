from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import QueryLog
from agents.orchestrator_agent import orchestrate
import glob
import os
from pathlib import Path
import time

router = APIRouter()
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", Path(__file__).resolve().parents[1] / "uploads"))

@router.post("/chat")
async def chat(question: str, db: Session = Depends(get_db)):
    start_time = time.time()

    csv_files = sorted(glob.glob(str(UPLOAD_DIR / "*.csv")), key=os.path.getmtime)
    csv_path = csv_files[-1] if csv_files else None

    result = orchestrate(question, csv_path=csv_path)

    response_time = time.time() - start_time

    log = QueryLog(
        question=question,
        answer=result["answer"],
        agents_used=",".join(result["agents_used"]),
        response_time=response_time
    )
    db.add(log)
    db.commit()

    return {
        "answer": result["answer"],
        "agents_used": result["agents_used"],
        "response_time": round(response_time, 2)
    }
