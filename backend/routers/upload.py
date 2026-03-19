import os
import shutil
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import DocumentLog

load_dotenv()

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads")))
TEMP_DIR = Path(os.getenv("TEMP_DIR", "/tmp/multi-agent-ai"))


def _safe_filename(filename: str) -> str:
    return Path(filename or "upload").name


def _temp_file_path(filename: str) -> Path:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    return TEMP_DIR / f"{uuid4().hex}_{_safe_filename(filename)}"


@router.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_pinecone import PineconeVectorStore
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from pinecone import Pinecone, ServerlessSpec

    temp_path = _temp_file_path(file.filename)

    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        loader = PyPDFLoader(str(temp_path))
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = splitter.split_documents(documents)

        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index_name = os.getenv("PINECONE_INDEX_NAME")

        if index_name not in pc.list_indexes().names():
            pc.create_index(
                name=index_name,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )

        PineconeVectorStore.from_documents(
            documents=chunks,
            embedding=embeddings,
            index_name=index_name
        )

        safe_name = _safe_filename(file.filename)
        log = DocumentLog(filename=safe_name, file_type="pdf")
        db.add(log)
        db.commit()

        return {"message": f"{safe_name} uploaded and indexed successfully"}
    finally:
        if temp_path.exists():
            temp_path.unlink()


@router.post("/upload/csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    safe_name = _safe_filename(file.filename)
    file_path = UPLOAD_DIR / safe_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    log = DocumentLog(filename=safe_name, file_type="csv")
    db.add(log)
    db.commit()

    return {
        "message": f"{safe_name} uploaded successfully",
        "filepath": str(file_path)
    }
