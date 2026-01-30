# Event-Driven Architecture Demo Guide - AI Todo Chatbot

## Overview
This document explains how to demonstrate the event-driven flow of the AI Todo Chatbot system for your hackathon presentation.

## Event-Driven Flow Architecture

### 1. Complete Flow Sequence
```
User Message → Frontend UI → HTTP Request → Backend API → LLM Processing → Task Creation → Database Update → UI Refresh
```

### 2. Key Events in the System

#### Event 1: User Message Submission
- **Trigger**: User submits a message in the chat interface
- **Component**: Frontend (page.tsx)
- **Action**: Sends POST request to `/api/chat`
- **Code Reference**: 
  ```javascript
  const response = await axios.post(`${BACKEND_API_URL}/api/chat`, {
    message: input,
  });
  ```

#### Event 2: API Request Reception
- **Trigger**: Backend receives the chat message
- **Component**: FastAPI (main.py)
- **Action**: `/api/{user_id}/chat` endpoint processes the request
- **Code Reference**:
  ```python
  @app.post("/api/{user_id}/chat")
  async def chat(user_id: str, req: ChatRequest):
  ```

#### Event 3: LLM Processing
- **Trigger**: Backend forwards message to Gemini AI
- **Component**: FastAPI (main.py)
- **Action**: AI analyzes message for task creation intent
- **Code Reference**:
  ```python
  response = gemini_model.generate_content(f"{context} User message: {req.message}")
  ```

#### Event 4: Task Extraction & Creation
- **Trigger**: LLM identifies task in user message
- **Component**: FastAPI (main.py)
- **Action**: Creates new task in database
- **Code Reference**:
  ```python
  @app.post("/api/{user_id}/tasks")
  async def create_task(user_id: str, task: TaskCreate):
  ```

#### Event 5: Database Update
- **Trigger**: Task creation request received
- **Component**: PostgreSQL via SQLAlchemy
- **Action**: Inserts new task record
- **Code Reference**:
  ```python
  db_task = TaskModel(**new_task)
  db.add(db_task)
  db.commit()
  ```

#### Event 6: Response Generation & UI Update
- **Trigger**: Backend responds to frontend
- **Component**: Frontend (page.tsx)
- **Action**: Updates chat UI with AI response
- **Code Reference**:
  ```javascript
  setMessages((prev) => [...prev, botMessage]);
  ```

## Demo Script for Hackathon Presentation

### Step 1: Prepare the Environment
1. Start all services: `docker-compose -f ./phase5/docker-compose.yml up -d`
2. Open browser to `http://localhost:3000`
3. Open a separate terminal to monitor logs

### Step 2: Show the Event Flow
1. **Open Browser DevTools** → Network Tab
2. **Open Backend Terminal** → Monitor logs: `docker logs -f todo-chatbot-backend`
3. **Open Database Terminal** (optional) → Monitor changes: `docker exec -it todo-chatbot-postgres psql -U todo_user -d todo_db`

### Step 3: Demonstrate the Flow
1. **Send a message**: Type "Create a task to water plants tomorrow at 8 AM"
2. **Show Network Activity**: Point to the POST request to `/api/chat` in DevTools
3. **Show Backend Processing**: Point to backend logs showing:
   - Message received
   - LLM processing
   - Task creation in database
4. **Show Database Update**: If monitoring database, show new task insertion
5. **Show UI Response**: Point to AI response in chat interface

### Step 4: Verify Database Change
```bash
# In terminal, run:
docker exec -it todo-chatbot-postgres psql -U todo_user -d todo_db -c "SELECT * FROM tasks;"
```

## Technical Verification Commands

### Verify Frontend-Backend Communication
```bash
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task to call mom"}'
```

### Verify Database Integration
```bash
docker exec -it todo-chatbot-postgres psql -U todo_user -d todo_db -c "SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;"
```

### Monitor All Services During Demo
```bash
# Monitor all services
docker-compose -f ./phase5/docker-compose.yml logs -f
```

## Kubernetes Deployment Verification

### Deploy to Minikube
```bash
# Create namespace
kubectl apply -f ./phase5/k8s/minikube/namespace.yaml

# Deploy PostgreSQL
kubectl apply -f ./phase5/k8s/minikube/postgres.yaml

# Deploy Backend
kubectl apply -f ./phase5/k8s/minikube/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f ./phase5/k8s/minikube/frontend-deployment.yaml
kubectl apply -f ./phase5/k8s/minikube/frontend-service.yaml
```

### Verify Kubernetes Deployment
```bash
# Check all pods
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app

# Monitor logs during demo
kubectl logs -f deployment/todo-frontend-deployment -n todo-app
kubectl logs -f deployment/todo-backend-deployment -n todo-app
```

## Key Points to Highlight During Demo

1. **Real-time Processing**: Show how quickly the message flows through the system
2. **Event Propagation**: Emphasize how one user action triggers multiple system events
3. **Data Persistence**: Demonstrate that tasks are actually saved to the database
4. **Scalability**: Mention how the microservice architecture allows independent scaling
5. **Error Handling**: Show how the system gracefully handles failures

## Troubleshooting Common Demo Issues

### Issue 1: API Key Missing
- **Symptom**: AI responses show "API key not configured"
- **Solution**: Ensure GEMINI_API_KEY is set in environment

### Issue 2: Database Connection Failure
- **Symptom**: Task creation fails
- **Solution**: Verify PostgreSQL is running and credentials are correct

### Issue 3: Frontend Cannot Reach Backend
- **Symptom**: Network errors in browser console
- **Solution**: Check NEXT_PUBLIC_BACKEND_API_URL is correctly set

This event-driven architecture demonstrates how user inputs trigger a cascade of automated actions across multiple services, showcasing modern microservices architecture principles.