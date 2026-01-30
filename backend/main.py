import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from enum import Enum

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Gemini AI Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
    logger.info("✅ Gemini AI configured")
else:
    gemini_model = None
    logger.warning("⚠️ GEMINI_API_KEY not set")

# --- Database & Models Setup ---
class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class RecurringInterval(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"

DB_AVAILABLE = False
tasks_storage = {} # Fallback Memory

try:
    from sqlalchemy import create_engine, Column, String, DateTime, Enum as SQLAlchemyEnum, func
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker

    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://todo_user:todo_password@postgres-service.todo-app.svc.cluster.local:5432/todo_db")
    engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 5})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    class TaskModel(Base):
        __tablename__ = "tasks"
        id = Column(String, primary_key=True, index=True)
        user_id = Column(String, index=True)
        title = Column(String, nullable=False)
        description = Column(String, default="")
        status = Column(String, default="pending")
        created_at = Column(DateTime, server_default=func.now())
        due_date = Column(DateTime, nullable=True)
        priority = Column(SQLAlchemyEnum(TaskPriority), default=TaskPriority.medium)
        tags = Column(String, nullable=True)
        recurring_interval = Column(SQLAlchemyEnum(RecurringInterval), nullable=True)

    Base.metadata.create_all(bind=engine)
    DB_AVAILABLE = True
    logger.info("✅ Connected to PostgreSQL")
except Exception as e:
    logger.warning(f"⚠️ Database fallback to Memory: {e}")

# --- FastAPI App ---
app = FastAPI(title="Todo AI Phase 5", version="5.0.0")

# --- Robust CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production use specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class TaskCreate(BaseModel):
    title: str
    description: str = ""
    status: str = "pending"
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    status: str
    created_at: datetime
    priority: TaskPriority
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

# --- Routes ---

@app.get("/health")
async def health():
    return {"status": "healthy", "db_connected": DB_AVAILABLE}

@app.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str):
    if DB_AVAILABLE:
        db = SessionLocal()
        tasks = db.query(TaskModel).filter(TaskModel.user_id == user_id).all()
        db.close()
        return tasks
    return [t for t in tasks_storage.values() if t["user_id"] == user_id]

@app.post("/api/{user_id}/tasks")
async def create_task(user_id: str, task: TaskCreate):
    task_id = str(uuid.uuid4())
    new_task = {
        "id": task_id,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        **task.dict()
    }
    if DB_AVAILABLE:
        db = SessionLocal()
        db_task = TaskModel(**new_task)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        db.close()
        return db_task
    tasks_storage[task_id] = new_task
    return new_task

@app.get("/api/{user_id}/tasks/count")
async def get_counts(user_id: str):
    tasks = await get_tasks(user_id)
    total = len(tasks)
    completed = len([t for t in tasks if (t.status if DB_AVAILABLE else t['status']) == "completed"])
    return {"total": total, "pending": total - completed, "completed": completed}

@app.get("/api/{user_id}/conversations")
async def conversations(user_id: str):
    return []

@app.post("/api/{user_id}/chat")
async def chat(user_id: str, req: ChatRequest):
    if not gemini_model:
        return {"response": "AI is currently offline."}
    try:
        tasks = await get_tasks(user_id)
        context = f"User has {len(tasks)} tasks."
        response = gemini_model.generate_content(f"{context} User message: {req.message}")
        return {"response": response.text}
    except Exception as e:
        return {"response": f"AI Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)