# AI-Powered Todo Chatbot - Event-Driven Architecture Verification Guide

## System Overview
The AI-Powered Todo Chatbot consists of three main components:
- **Frontend**: Next.js 13/14 application with chat interface
- **Backend**: FastAPI server with LLM integration
- **Database**: PostgreSQL for persistent storage

## Event-Driven Flow

### 1. Message Flow Process
```
User Input → Frontend → Backend API → LLM Processing → Task Creation → Database Storage
```

### 2. Key Events in the System
1. **Message Received Event**: Triggered when user sends a message in the chat
2. **LLM Processing Event**: Triggered when backend receives message and sends to LLM
3. **Task Creation Event**: Triggered when LLM identifies a task in the message
4. **Database Update Event**: Triggered when task is stored in PostgreSQL

## Verification Steps for Event-Driven Architecture

### Step 1: Verify Frontend-Backend Communication
```bash
# Test the chat endpoint directly
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'
```

### Step 2: Verify LLM Integration
Check backend logs for LLM processing:
```bash
# View backend logs
docker logs todo-backend

# Look for entries like:
# ✅ Gemini AI configured
# Processing message: "Add a task to buy groceries"
```

### Step 3: Verify Task Creation Logic
Test the task creation endpoint:
```bash
# Direct task creation test
curl -X POST http://localhost:8000/api/user123/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs", "priority": "medium"}'
```

### Step 4: Verify Database Integration
Check if tasks are stored in PostgreSQL:
```bash
# Connect to PostgreSQL container
docker exec -it todo-postgres psql -U todo_user -d todo_db

# Check tasks table
SELECT * FROM tasks;
```

### Step 5: End-to-End Test
Perform a complete flow test:
1. Send a message to the chatbot requesting task creation
2. Monitor backend logs for processing
3. Verify task appears in database
4. Check if task appears in frontend UI

Example test message: "Please create a task to schedule dentist appointment for next week"

### Step 6: Monitor Event Logs
Check for event-driven behavior in logs:
```bash
# Monitor all services
docker-compose -f ./phase5/docker-compose.yml logs -f

# Look for these log patterns:
# - "User message received: [message]"
# - "Processing with LLM: [response]"
# - "Creating task: [task details]"
# - "Task created with ID: [ID]"
```

### Step 7: Database Consistency Check
Verify that tasks created via chat messages are properly stored:
```sql
-- In PostgreSQL
SELECT id, user_id, title, description, status, created_at, priority 
FROM tasks 
WHERE title LIKE '%dentist%' OR title LIKE '%groceries%';
```

## Kubernetes Deployment Verification

### Deploy to Kubernetes
```bash
# Apply all deployments
kubectl apply -f ./phase5/k8s/minikube/namespace.yaml
kubectl apply -f ./phase5/k8s/minikube/postgres.yaml
kubectl apply -f ./phase5/k8s/minikube/backend-deployment.yaml
kubectl apply -f ./phase5/k8s/minikube/todo-frontend-k8s.yaml
```

### Verify Kubernetes Services
```bash
# Check all pods are running
kubectl get pods -n todo-app

# Check all services are available
kubectl get svc -n todo-app

# Check ingress (if using)
kubectl get ingress -n todo-app
```

### Kubernetes Event Monitoring
```bash
# Monitor pod logs
kubectl logs -f deployment/todo-backend-deployment -n todo-app
kubectl logs -f deployment/todo-frontend-deployment -n todo-app

# Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

## Health Checks

### API Health Endpoint
```bash
# Check backend health
curl http://localhost:8000/health
# Expected: {"status": "healthy", "db_connected": true}
```

### Database Connection
```bash
# Check if database connection is active
curl http://localhost:8000/api/user123/tasks/count
# Expected: {"total": X, "pending": Y, "completed": Z}
```

## Troubleshooting Common Issues

### Issue 1: LLM Not Responding
- Check GEMINI_API_KEY in environment
- Verify internet connectivity to Google services
- Check backend logs for API errors

### Issue 2: Database Connection Failure
- Verify PostgreSQL is running and healthy
- Check DATABASE_URL configuration
- Ensure proper network connectivity between services

### Issue 3: Frontend Cannot Reach Backend
- Verify NEXT_PUBLIC_BACKEND_API_URL is set correctly
- Check CORS configuration in FastAPI
- Ensure backend service is accessible from frontend

## Performance Monitoring

### Container Resource Usage
```bash
# Monitor resource usage
docker stats

# Or for Kubernetes
kubectl top pods -n todo-app
```

### Response Time Testing
```bash
# Test API response times
time curl -X POST http://localhost:8000/api/user123/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Say hello"}'
```

This verification process ensures that the event-driven architecture is functioning correctly, with messages from the chatbot triggering appropriate task creation in the database via the backend.