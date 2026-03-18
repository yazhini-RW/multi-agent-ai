from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from .connection import Base

class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)
    agents_used = Column(String)
    response_time = Column(Float)
    created_at = Column(DateTime, default=func.now())

class DocumentLog(Base):
    __tablename__ = "document_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_type = Column(String)
    uploaded_at = Column(DateTime, default=func.now())