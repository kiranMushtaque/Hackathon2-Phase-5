from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import databases
import sqlalchemy

DATABASE_URL = "postgresql://user:password@db/tododb"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

app = FastAPI()

class Task(BaseModel):
    title: str
    description: str

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/api/chat")
async def chat(message: str):
    # Logic to process the message and create a task
    task = Task(title="New Task from Chat", description=message)
    await create_task(task)
    return {"message": "Task created", "task": task}

async def create_task(task: Task):
    query = "INSERT INTO tasks (title, description) VALUES (:title, :description)"
    await database.execute(query, values={"title": task.title, "description": task.description})