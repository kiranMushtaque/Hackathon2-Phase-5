# deploy-local.ps1
# Script to deploy the application locally on Minikube using free-tier tools

Write-Host "🚀 Starting local deployment with free-tier tools..." -ForegroundColor Green

# Check if kubectl is available
if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl is not installed. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Check if Dapr is initialized
$dapr_status = kubectl get pods -n dapr-system --no-headers 2>$null
if (!$dapr_status) {
    Write-Host "❌ Dapr is not initialized. Please run setup-minikube.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dapr is running" -ForegroundColor Green

# Check if Kafka namespace exists
$kafka_ns = kubectl get namespace kafka --no-headers 2>$null
if (!$kafka_ns) {
    Write-Host "❌ Kafka namespace does not exist. Please run setup-minikube.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Kafka namespace exists" -ForegroundColor Green

# Deploy Kafka topics
Write-Host "🔄 Deploying Kafka topics..." -ForegroundColor Yellow
kubectl apply -f ../k8s/minikube/kafka-deployment.yaml

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy Kafka topics" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Kafka topics deployed" -ForegroundColor Green

# Create secrets if they don't exist
Write-Host "🔄 Creating secrets..." -ForegroundColor Yellow
$secret_exists = kubectl get secret openai-secret -n todo-app --ignore-not-found=true
if (!$secret_exists) {
    # Create a dummy secret for local development
    kubectl create namespace todo-app --dry-run=client -o yaml | kubectl apply -f -
    kubectl create secret generic openai-secret --from-literal=api-key=dummy-key -n todo-app
}

Write-Host "✅ Secrets created" -ForegroundColor Green

# Deploy Dapr components
Write-Host "🔄 Deploying Dapr components..." -ForegroundColor Yellow
kubectl apply -f ../dapr/components/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy Dapr components" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dapr components deployed" -ForegroundColor Green

# Deploy application
Write-Host "🔄 Deploying application..." -ForegroundColor Yellow
kubectl apply -f ../k8s/minikube/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy application" -ForegroundColor Red
    exit 1
}

Write-Host "⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=Ready pod -l app=backend -n todo-app --timeout=300s
kubectl wait --for=condition=Ready pod -l app=frontend -n todo-app --timeout=300s

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployments failed to become ready" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Application deployments are ready" -ForegroundColor Green

# Display service information
Write-Host "`n📋 Service Information:" -ForegroundColor Cyan
kubectl get svc -n todo-app

Write-Host "`n🔗 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: Run 'minikube service frontend-service -n todo-app' to get the URL"
Write-Host "   Backend:  Run 'minikube service backend-service -n todo-app' to get the URL"

Write-Host "`n🎉 Local deployment with free-tier tools complete!" -ForegroundColor Green