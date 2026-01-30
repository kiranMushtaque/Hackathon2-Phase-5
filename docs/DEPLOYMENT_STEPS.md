# Deployment Steps Guide

## Prerequisites

Before deploying the Todo AI Chatbot, ensure you have the following tools installed:

### Local Development
- Docker Desktop with Kubernetes enabled
- Minikube (v1.28+)
- kubectl (v1.25+)
- Helm (v3+)
- Dapr CLI
- Node.js (v18+)
- Python (v3.11+)

### Cloud Deployment
- Azure CLI (for AKS) or Google Cloud CLI (for GKE)
- Access to a cloud account with appropriate permissions
- Container registry (Docker Hub, Azure Container Registry, etc.)

## Local Deployment Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon-2/phase5
```

### 2. Set Up Minikube Environment
Run the setup script to prepare your local Kubernetes environment:

```powershell
# On Windows
.\scripts\setup-minikube.ps1
```

This script will:
- Start Minikube with appropriate resources
- Install and configure Dapr
- Install Strimzi Kafka operator
- Prepare the Kafka namespace

### 3. Build Docker Images
Build the frontend and backend Docker images:

```bash
# Build frontend
cd frontend
docker build -t todo-frontend:latest .

# Build backend
cd ../backend
docker build -t todo-backend:latest .
```

### 4. Deploy Kafka Cluster
Deploy the Kafka cluster and topics:

```bash
kubectl apply -f k8s/minikube/kafka-deployment.yaml
```

Wait for Kafka to be ready:
```bash
kubectl wait --for=condition=Ready pod -l strimzi.io/name=my-cluster-kafka -n kafka --timeout=300s
```

### 5. Deploy Dapr Components
Deploy the Dapr components for pub/sub and state management:

```bash
kubectl apply -f dapr/components/
```

### 6. Deploy the Application
Deploy the frontend and backend services:

```bash
kubectl apply -f k8s/minikube/
```

Wait for deployments to be ready:
```bash
kubectl wait --for=condition=Ready pod -l app=backend -n todo-app --timeout=300s
kubectl wait --for=condition=Ready pod -l app=frontend -n todo-app --timeout=300s
```

### 7. Access the Application
Get the service URLs:

```bash
# Get frontend URL
minikube service frontend-service -n todo-app

# Get backend URL
minikube service backend-service -n todo-app
```

## Cloud Deployment Steps (AKS)

### 1. Prepare Azure Resources
Create a resource group and AKS cluster:

```bash
# Create resource group
az group create --name todo-resource-group --location eastus

# Create AKS cluster
az aks create \
  --resource-group todo-resource-group \
  --name todo-cluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys
```

### 2. Get Cluster Credentials
```bash
az aks get-credentials --resource-group todo-resource-group --name todo-cluster
```

### 3. Install Dapr
```bash
dapr init -k
```

### 4. Build and Push Images
Build Docker images and push to a container registry:

```bash
# Tag and push frontend
docker tag todo-frontend:latest <registry>/todo-frontend:<version>
docker push <registry>/todo-frontend:<version>

# Tag and push backend
docker tag todo-backend:latest <registry>/todo-backend:<version>
docker push <registry>/todo-backend:<version>
```

### 5. Update Deployment Files
Update the image references in the Kubernetes deployment files to point to your container registry.

### 6. Deploy to AKS
```bash
kubectl apply -f k8s/cloud/
kubectl apply -f dapr/components/
```

## Cloud Deployment Steps (GKE)

### 1. Prepare Google Cloud Resources
Create a GKE cluster:

```bash
# Set project ID
gcloud config set project <project-id>

# Create cluster
gcloud container clusters create todo-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --enable-autorepair \
  --enable-autoupgrade
```

### 2. Get Cluster Credentials
```bash
gcloud container clusters get-credentials todo-cluster --zone us-central1-a
```

### 3. Install Dapr
```bash
dapr init -k
```

### 4. Build and Push Images
Follow the same steps as for AKS to build and push Docker images.

### 5. Deploy to GKE
```bash
kubectl apply -f k8s/cloud/
kubectl apply -f dapr/components/
```

## Configuration Management

### Environment Variables
The application uses the following environment variables:

**Backend:**
- `OPENAI_API_KEY`: API key for OpenAI services
- `DATABASE_URL`: Connection string for PostgreSQL database
- `KAFKA_BROKER`: Kafka broker address

**Frontend:**
- `BACKEND_API_URL`: URL of the backend service

### Secrets Management
For production deployments, store sensitive information in Kubernetes secrets:

```bash
# Create OpenAI API key secret
kubectl create secret generic openai-secret \
  --from-literal=api-key=<your-openai-api-key> \
  -n todo-app
```

## Monitoring and Logging

### Dapr Dashboard
Monitor Dapr services with the dashboard:

```bash
dapr dashboard -k
```

### Kubernetes Metrics
Check resource utilization:

```bash
kubectl top nodes
kubectl top pods
```

### Application Logs
View application logs:

```bash
# Backend logs
kubectl logs -f deployment/backend-deployment -n todo-app

# Frontend logs
kubectl logs -f deployment/frontend-deployment -n todo-app

# Dapr sidecar logs
kubectl logs -f deployment/backend-deployment -n todo-app -c daprd
```

## Scaling the Application

### Horizontal Pod Autoscaler
Apply HPA for automatic scaling:

```bash
kubectl autoscale deployment backend-deployment \
  --cpu-percent=70 \
  --min=1 \
  --max=10 \
  -n todo-app
```

### Manual Scaling
Scale deployments manually:

```bash
kubectl scale deployment backend-deployment --replicas=3 -n todo-app
kubectl scale deployment frontend-deployment --replicas=3 -n todo-app
```

## Troubleshooting

### Common Issues

1. **Dapr Sidecar Not Starting**
   - Check Dapr system pods: `kubectl get pods -n dapr-system`
   - Verify Dapr is initialized: `dapr status -k`

2. **Kafka Connection Issues**
   - Verify Kafka cluster status: `kubectl get kafka -n kafka`
   - Check Kafka pods: `kubectl get pods -n kafka`

3. **Service Discovery Problems**
   - Ensure Dapr annotations are present in deployment YAMLs
   - Check service names match between frontend and backend

### Debugging Commands

```bash
# Check all pods
kubectl get pods -n todo-app

# Check all services
kubectl get svc -n todo-app

# Describe a specific pod for detailed info
kubectl describe pod <pod-name> -n todo-app

# Check Dapr sidecar configuration
kubectl describe pod <pod-name> -n todo-app | grep dapr
```

## Cleanup

### Local Environment
Stop and delete Minikube:

```bash
minikube stop
minikube delete
```

### Cloud Resources
Delete cloud resources when no longer needed:

**AKS:**
```bash
az group delete --name todo-resource-group --yes --no-wait
```

**GKE:**
```bash
gcloud container clusters delete todo-cluster --zone us-central1-a
```