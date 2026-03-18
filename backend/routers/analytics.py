from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from database.models import QueryLog, DocumentLog

router = APIRouter()

@router.get("/analytics/queries")
def get_query_logs(db: Session = Depends(get_db)):
    logs = db.query(QueryLog).order_by(QueryLog.created_at.desc()).limit(50).all()
    return [
        {
            "id": log.id,
            "question": log.question,
            "agents_used": log.agents_used,
            "response_time": log.response_time,
            "created_at": str(log.created_at)
        }
        for log in logs
    ]

@router.get("/analytics/stats")
def get_stats(db: Session = Depends(get_db)):
    total_queries = db.query(QueryLog).count()
    avg_response_time = db.query(func.avg(QueryLog.response_time)).scalar()
    total_documents = db.query(DocumentLog).count()

    agent_usage = {}
    logs = db.query(QueryLog).all()
    for log in logs:
        if log.agents_used:
            for agent in log.agents_used.split(","):
                agent = agent.strip()
                agent_usage[agent] = agent_usage.get(agent, 0) + 1

    return {
        "total_queries": total_queries,
        "avg_response_time": round(avg_response_time or 0, 2),
        "total_documents": total_documents,
        "agent_usage": agent_usage
    }