from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database.connection import engine
from database import models
from routers import chat, upload, analytics

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Agent AI Business Intelligence System",
    description="An AI system with multiple specialized agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "Multi-Agent AI System is running!"}