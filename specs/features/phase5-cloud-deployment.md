# Phase V: Advanced Todo AI Chatbot with Free-Tier Tools

## Overview
This document specifies Phase V of the Todo AI Chatbot project, implementing advanced features using free-tier tools only.

## Architecture Components

### 1. Frontend (ChatKit UI)
- **Technology**: Next.js 14+ with App Router
- **Features**:
  - Conversational UI for task management
  - Real-time updates via WebSocket
  - Task visualization (priorities, tags, due dates)
  - Responsive design for all devices

### 2. Backend (FastAPI + MCP + Agents SDK)
- **Technology**: FastAPI, Python 3.11+
- **Features**:
  - AI-powered task processing
  - MCP integration for enhanced capabilities
  - Event-driven architecture
  - Advanced task management (recurring, reminders)

### 3. Event Streaming (Redpanda - Free-Tier Kafka)
- **Technology**: Redpanda (free-tier Kafka alternative)
- **Topics**:
  - `task-events`: Task lifecycle events
  - `reminders`: Reminder notifications
  - `task-updates`: Task update notifications

### 4. Dapr Integration
- **Pub/Sub**: Kafka abstraction for event streaming
- **State Management**: Conversation state and task cache
- **Jobs API**: Scheduled reminders and recurring tasks
- **Secrets Management**: API keys and DB credentials
- **Service Invocation**: Frontend → Backend communication

## Advanced Features Implementation

### 1. Recurring Tasks
- Daily, weekly, monthly recurrence patterns
- Automatic task regeneration
- Recurrence rule customization

### 2. Due Dates & Reminders
- Calendar integration for due dates
- Time-based reminders (1 hour, 1 day before)
- Push notification system

### 3. Intermediate Features
- **Priorities**: Low, Medium, High priority levels
- **Tags**: Custom tagging system for categorization
- **Search**: Full-text search across tasks
- **Filter**: Filter by priority, tags, due date, completion status
- **Sort**: Sort by due date, priority, creation date

### 4. Event-Driven Architecture
- Decoupled services via Kafka pub/sub
- Real-time event processing
- Scalable event handling

## Free-Tier Deployment Strategy

### Local Deployment (Minikube)
- Minikube Kubernetes cluster
- Docker Desktop containerization
- Helm charts for deployment
- Dapr locally with components YAML
- Redpanda Docker container for Kafka
- MCP tools integration

### Cloud Deployment (Free Tier)
- Oracle Cloud Always Free: OKE K8s cluster (4 OCPUs + 24GB RAM)
- Redpanda Cloud Free Tier for Kafka (5 topics)
- Dapr components and Helm charts
- Stateless AI chatbot with cloud DB

## File Structure
```
phase5/
├── frontend/ (ChatKit UI)
├── backend/ (FastAPI + MCP + Agents SDK)
├── k8s/
│   ├── minikube/
│   └── cloud/helm-charts/
├── dapr/components/
├── docker/docker-compose.yml
├── scripts/ (setup & deploy scripts)
└── specs/
```

## Critical Files

### Backend Deployment with Dapr Annotations
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: todo-app
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "backend-service"
        dapr.io/app-port: "8000"
```

### Kafka Deployment (Redpanda)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redpanda
spec:
  containers:
  - name: redpanda
    image: docker.redpanda.com/redpandadata/redpanda:v23.2.15
```

### Dapr Components
- kafka-pubsub.yaml: Kafka pub/sub abstraction
- statestore.yaml: State management
- dapr-jobs.yaml: Scheduled jobs for reminders
- kubernetes-secrets.yaml: Secret management

## Testing Requirements

### Functional Tests
- Tasks can be created, updated, completed, deleted via AI chatbot
- Recurring tasks and reminders trigger correctly
- Multiple clients see real-time updates
- Conversation state persists across stateless requests
- Friendly confirmations for every action
- Graceful error handling

### Performance Tests
- Response time under 2 seconds for AI processing
- Event processing within 1 second
- Concurrent user handling (up to 100 simulated users)

## Deployment & CI/CD

### GitHub Actions Workflow
- Automated local/cloud deployment
- Docker image building and pushing
- Helm chart deployment
- Health checks and rollbacks

### Monitoring & Logging
- Dapr dashboard for service monitoring
- Kubernetes metrics
- Application logs aggregation
- Error tracking and alerts

## Free-Tier Compliance

### Cost Management
- All components selected for free-tier eligibility
- Resource limits set to stay within free-tier quotas
- Monitoring to prevent unexpected charges
- Cleanup scripts to terminate resources when not needed

### Alternative Services
- Redpanda instead of Confluent Cloud Kafka
- Oracle Cloud Always Free instead of paid K8s
- Self-hosted Redis instead of ElastiCache
- PostgreSQL on local cluster instead of RDS

## Success Criteria

### Technical
- All advanced features implemented and tested
- Event-driven architecture operational
- Dapr integration complete
- Free-tier deployment successful

### Functional
- AI chatbot processes all task operations correctly
- Recurring tasks and reminders work reliably
- Real-time updates across clients
- Advanced filtering and sorting functional

### Performance
- Sub-second response times
- Reliable event processing
- Stable system under load
- Efficient resource utilization