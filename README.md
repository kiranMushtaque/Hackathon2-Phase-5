# Hackathon-2 Phase-5: Advanced Todo AI Chatbot with Free-Tier Tools

## Overview

This is Phase 5 of the Todo AI Chatbot project, implementing advanced features using only free-tier tools. The system includes recurring tasks, due dates & reminders, advanced filtering, and an event-driven architecture with Kafka and Dapr.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Redpanda      │
│   (Next.js)     │◄──►│   (FastAPI)      │◄──►│   (Kafka)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────────────────┐
                       │    Dapr Runtime  │
                       │   (Sidecar)      │
                       └──────────────────┘
                              │
                       ┌──────────────────┐
                       │  State Store      │
                       │  (PostgreSQL)    │
                       └──────────────────┘
```

## Features

### Advanced Task Management
- **Recurring Tasks**: Daily, weekly, monthly recurrence patterns
- **Due Dates & Reminders**: Time-based notifications
- **Priorities**: Low, Medium, High priority levels
- **Tags**: Custom tagging system for categorization
- **Search & Filter**: Full-text search and advanced filtering
- **Sort**: Multiple sorting options

### Event-Driven Architecture
- **Kafka Topics**:
  - `task-events`: Task lifecycle events
  - `reminders`: Reminder notifications
  - `task-updates`: Task update notifications
- **Real-time Processing**: Event-based task management

### Dapr Integration
- **Pub/Sub**: Kafka abstraction for event streaming
- **State Management**: Conversation state and task cache
- **Jobs API**: Scheduled reminders and recurring tasks
- **Secrets Management**: Secure API key handling
- **Service Invocation**: Inter-service communication

## Free-Tier Tools Used

- **Kubernetes**: Minikube for local, Oracle Cloud Always Free OKE for cloud
- **Kafka Alternative**: Redpanda (free-tier compatible)
- **Container Registry**: Docker Hub free tier
- **Monitoring**: Dapr dashboard and Kubernetes native tools
- **Database**: PostgreSQL (self-hosted in cluster)

## Prerequisites

- Docker Desktop with Kubernetes enabled
- Minikube (v1.28+)
- kubectl
- Helm (v3+)
- Dapr CLI
- Node.js (v18+)
- Python (v3.11+)

## Local Deployment

### 1. Setup Environment
```bash
# Run setup script
./scripts/setup-minikube.ps1
```

### 2. Build Docker Images
```bash
# Build frontend
cd frontend
docker build -t todo-frontend:latest .

# Build backend
cd ../backend
docker build -t todo-backend:latest .
```

### 3. Deploy Application
```bash
# Deploy locally
./scripts/deploy-local.ps1
```

### 4. Access the Application
```bash
# Get frontend URL
minikube service frontend-service -n todo-app

# Get backend URL
minikube service backend-service -n todo-app
```

## Cloud Deployment (Free Tier)

### Oracle Cloud Always Free (OKE)
```bash
# Deploy to OKE
./scripts/deploy-cloud.ps1 -Platform oke -ResourceGroup my-rg -ClusterName my-cluster
```

### Google Cloud Free Tier (GKE)
```bash
# Deploy to GKE
./scripts/deploy-cloud.ps1 -Platform gke-free -ResourceGroup my-project -ClusterName my-cluster
```

## Testing

### Functional Tests
1. Create tasks via AI chatbot
2. Verify recurring tasks creation
3. Test due date reminders
4. Validate advanced filtering and sorting
5. Confirm real-time updates across clients

### Event-Driven Tests
1. Task creation triggers Kafka events
2. Reminder events are published correctly
3. Recurring tasks are scheduled properly
4. State management works across services

## Dapr Components

### Kafka Pub/Sub
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  metadata:
  - name: brokers
    value: "redpanda-service:9092"
```

### State Management
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: postgres-state
spec:
  type: state.postgresql
  metadata:
  - name: connectionString
    value: "host=postgres-service port=5432 user=user password=password dbname=todo_db sslmode=disable"
```

## Monitoring and Logging

### Dapr Dashboard
```bash
dapr dashboard -k
```

### Kubernetes Metrics
```bash
kubectl top nodes
kubectl top pods
```

### Application Logs
```bash
# Backend logs
kubectl logs -f deployment/backend-deployment -n todo-app

# Dapr sidecar logs
kubectl logs -f deployment/backend-deployment -n todo-app -c daprd
```

## Cleanup

### Local Environment
```bash
minikube stop
minikube delete
```

## Troubleshooting

### Common Issues
1. **Dapr Sidecar Not Starting**: Verify Dapr is initialized with `dapr status -k`
2. **Redpanda Connection Issues**: Check Redpanda pod status with `kubectl get pods -n kafka`
3. **Service Discovery Problems**: Ensure Dapr annotations are present in deployment YAMLs

### Debugging Commands
```bash
# Check all pods
kubectl get pods -n todo-app

# Describe a specific pod
kubectl describe pod <pod-name> -n todo-app

# Check Dapr sidecar configuration
kubectl get pods -n todo-app -o yaml | grep dapr
```

## Cost Management

This implementation uses only free-tier eligible services:
- Oracle Cloud Always Free for Kubernetes
- Redpanda Cloud Free Tier for Kafka (5 topics)
- Self-hosted PostgreSQL and Redis in cluster
- Dapr for service mesh (runs in cluster)

Always monitor resource usage to stay within free-tier limits.