# Multi-Agent AI Business Intelligence System

A production-level AI platform where multiple specialized agents collaborate to answer questions, analyze documents, search the web, and visualize data — all in one unified interface.

Built with **LangChain · FastAPI · Pinecone · PostgreSQL · Next.js 14 · Groq**

---

## What It Does

This system routes every user query to the right AI agent automatically. You ask a question — the Orchestrator decides which agents to call, gathers their outputs, and returns one combined, intelligent answer.

---

## Architecture

```
User Query
    |
Orchestrator Agent  --->  decides which agents to use
    |---->  Document Agent   (answers from uploaded PDFs via Pinecone)
    |---->  Search Agent     (searches the web in real time via Tavily)
    `---->  Analyst Agent    (reads and analyzes uploaded CSVs)
              |
        Combined Final Answer
              |
        Saved to PostgreSQL  -->  Shown on Dashboard
```

---

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Frontend         | Next.js 14 (App Router), TypeScript |
| Styling          | Tailwind CSS                        |
| Charts           | Recharts                            |
| AI / LLM         | Groq (llama-3.3-70b-versatile)      |
| Agent Framework  | LangChain                           |
| Backend          | FastAPI (Python)                    |
| Vector Database  | Pinecone                            |
| Embeddings       | HuggingFace (all-MiniLM-L6-v2)     |
| Database         | PostgreSQL + SQLAlchemy             |
| Web Search       | Tavily API                          |

---

## Project Structure

```
multi-agent-ai/
|-- backend/
|   |-- agents/
|   |   |-- document_agent.py       # RAG agent using Pinecone
|   |   |-- search_agent.py         # Web search via Tavily
|   |   |-- analyst_agent.py        # CSV data analysis
|   |   `-- orchestrator_agent.py   # Routes queries to agents
|   |-- database/
|   |   |-- connection.py           # PostgreSQL connection
|   |   `-- models.py               # QueryLog + DocumentLog tables
|   |-- routers/
|   |   |-- chat.py                 # POST /api/chat
|   |   |-- upload.py               # POST /api/upload/pdf & /csv
|   |   `-- analytics.py            # GET /api/analytics/stats & /queries
|   |-- uploads/                    # Uploaded CSV files
|   |-- main.py                     # FastAPI app entry point
|   `-- .env                        # API keys (not committed)
|
`-- frontend/
    |-- app/
    |   |-- chat/page.tsx           # Chat interface page
    |   |-- upload/page.tsx         # File upload page
    |   |-- dashboard/page.tsx      # Analytics dashboard page
    |   |-- layout.tsx              # Root layout with Sidebar
    |   `-- page.tsx                # Home / landing page
    |-- components/
    |   |-- Sidebar.tsx             # Navigation sidebar
    |   |-- ChatInterface.tsx       # Chat UI with agent tags
    |   |-- UploadPanel.tsx         # PDF + CSV upload UI
    |   `-- Dashboard.tsx           # Charts + query log UI
    `-- lib/
        `-- api.ts                  # Axios API helper functions
```

---

## Setup and Installation

### Prerequisites

- Python 3.11
- Node.js v20+
- PostgreSQL (running on port 5432)
- Accounts on: Groq (console.groq.com), Pinecone (pinecone.io), Tavily (app.tavily.com)

---

### 1. Clone / Open the project

```bash
cd C:\multi-agent-ai
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install fastapi uvicorn python-multipart langchain langchain-openai \
  langchain-community langchain-groq langchain-pinecone langchain-huggingface \
  langchain-text-splitters langchain-core pinecone-client openai pypdf pandas \
  sqlalchemy psycopg2-binary python-dotenv tavily-python tiktoken \
  sentence-transformers
```

---

### 3. Create the .env file

Inside `backend/`, create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_key_here
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=multi-agent-index
TAVILY_API_KEY=your_tavily_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/multiagentdb
```

---

### 4. Create the PostgreSQL database

```bash
psql -U postgres
```
```sql
CREATE DATABASE multiagentdb;
\q
```

---

### 5. Run the backend

```bash
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`  
API docs at: `http://127.0.0.1:8000/docs`

---

### 6. Frontend Setup

Open a new terminal:

```bash
cd C:\multi-agent-ai\frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Deploy on Render

This repo includes a root-level `render.yaml` Blueprint so Render can provision the whole stack from one repository:

- `multi-agent-api` for FastAPI
- `multi-agent-frontend` for Next.js
- `multi-agent-db` for PostgreSQL

### Required secrets

Render will ask for these during the first Blueprint deploy:

```env
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=
TAVILY_API_KEY=
GROQ_API_KEY=
```

`DATABASE_URL` is populated automatically from the Render Postgres service.

### Deploy steps

1. Push the repo to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select this repository.
4. Review the generated services and database.
5. Enter the required secrets.
6. Click `Apply`.

### Render-specific behavior

- The backend starts with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- The frontend starts with `next start` on `0.0.0.0` and builds the backend URL automatically from Render's external hostname.
- CSV uploads are written to `/tmp/multi-agent-ai/uploads` in the default free-tier setup.
- Temporary PDF processing files are stored in `/tmp/multi-agent-ai` and cleaned up after indexing.
- As of March 19, 2026, Render's free web services do not support persistent disks. If you want CSV uploads to survive restarts and redeploys, upgrade the backend service to a paid instance and attach a disk, then set `UPLOAD_DIR` to that mount path.

---

## Features

### Chat (`/chat`)
Ask any question in natural language. The Orchestrator automatically selects the right agent(s), shows which agents were triggered, and displays the response time. Powered by Groq's llama-3.3-70b-versatile model.

### Upload PDF (`/upload`)
Upload any PDF document. The file is chunked, embedded with HuggingFace, and indexed in Pinecone. The chat can then answer questions about the document using RAG.

### Upload CSV (`/upload`)
Upload any CSV data file. The Analyst Agent reads and analyzes it when you ask questions in chat.

### Dashboard (`/dashboard`)
Displays total queries, average response time, documents uploaded, an agent usage pie chart, a response times bar chart, and a full log of all recent questions with timestamps.

### API Docs (`http://127.0.0.1:8000/docs`)
Interactive Swagger UI for testing all endpoints directly in the browser.

---

## The 4 Agents

| Agent            | Trigger                              | What It Does                                                               |
|------------------|--------------------------------------|----------------------------------------------------------------------------|
| Document Agent   | Questions about uploaded files       | Searches Pinecone, retrieves relevant chunks, answers via LLM             |
| Search Agent     | Real-time or current info questions  | Queries the web using Tavily and returns top results                      |
| Analyst Agent    | Data / CSV questions                 | Reads uploaded CSV with Pandas, summarizes stats, answers via LLM        |
| Orchestrator     | Every query                          | Decides which agents to call and combines their outputs into one answer   |

---

## Testing the App

Run these prompts in order to verify each feature:

```
1. Chat  ->  "What are the latest AI tools in 2026?"
   Expected: search_agent tag shown

2. Upload a CSV  ->  then ask "analyze my data and give me a summary"
   Expected: analyst_agent tag shown

3. Upload a PDF  ->  then ask "what is this document about?"
   Expected: document_agent tag shown

4. Visit /dashboard  ->  stats and charts update with your activity
```

---

## Viewing the Database

```bash
psql -U postgres -d multiagentdb
```

```sql
SELECT * FROM query_logs;
SELECT * FROM document_logs;
```

Or open pgAdmin and navigate to:
`Servers -> PostgreSQL -> Databases -> multiagentdb -> Schemas -> Tables`

---

## Clearing History

```bash
psql -U postgres -d multiagentdb
```
```sql
DELETE FROM query_logs;
DELETE FROM document_logs;
\q
```

---

## API Endpoints

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| POST   | /api/chat                 | Send a question, get an AI answer        |
| POST   | /api/upload/pdf           | Upload and index a PDF into Pinecone     |
| POST   | /api/upload/csv           | Upload a CSV for analysis                |
| GET    | /api/analytics/stats      | Total queries, avg response time, counts |
| GET    | /api/analytics/queries    | Last 50 query logs                       |

---

## Business Alignment

This project is a working prototype of enterprise AI products, covering:

- **Textual AI** — Document Agent using RAG on PDFs
- **Functional AI** — Orchestrator routing queries intelligently
- **Analytical AI** — CSV Analyst and Dashboard
- **Knowledge Systems** — Pinecone vector search
- **AI Chatbot** — Groq-powered conversational interface

---
