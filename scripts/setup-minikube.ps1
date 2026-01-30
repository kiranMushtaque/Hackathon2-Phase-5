# setup-minikube.ps1
# Script to set up Minikube environment with Dapr and Redpanda (free-tier Kafka alternative)

Write-Host "🚀 Setting up Minikube environment with free-tier tools..." -ForegroundColor Green

# Check if Minikube is installed
if (!(Get-Command minikube -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Minikube is not installed. Please install Minikube first." -ForegroundColor Red
    exit 1
}

# Check if kubectl is installed
if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl is not installed. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Start Minikube with sufficient resources
Write-Host "🔄 Starting Minikube..." -ForegroundColor Yellow
minikube start --cpus=4 --memory=8192 --driver=hyperv

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Minikube" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Minikube started successfully" -ForegroundColor Green

# Enable ingress addon
Write-Host "🔄 Enabling ingress addon..." -ForegroundColor Yellow
minikube addons enable ingress

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to enable ingress addon" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Ingress addon enabled" -ForegroundColor Green

# Check if Dapr CLI is installed
if (!(Get-Command dapr -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Dapr CLI..." -ForegroundColor Yellow
    $dapr_install = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1" -UseBasicParsing
    Invoke-Expression $dapr_install
}

# Initialize Dapr on Kubernetes
Write-Host "🔄 Installing Dapr on Kubernetes..." -ForegroundColor Yellow
dapr init -k

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize Dapr" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dapr installed successfully" -ForegroundColor Green

# Create Kafka namespace
Write-Host "🔄 Creating Kafka namespace..." -ForegroundColor Yellow
kubectl create namespace kafka

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Kafka namespace" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Kafka namespace created" -ForegroundColor Green

# Deploy Redpanda (free-tier Kafka alternative)
Write-Host "🔄 Deploying Redpanda (free-tier Kafka alternative)..." -ForegroundColor Yellow
kubectl apply -f https://vectorized.io/yaml/redpanda.yaml

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy Redpanda" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Redpanda deployed successfully" -ForegroundColor Green

# Wait for Redpanda to be ready
Write-Host "⏳ Waiting for Redpanda to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=redpanda -n kafka --timeout=300s

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Redpanda failed to become ready" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Redpanda is ready" -ForegroundColor Green

Write-Host "🎉 Minikube setup with free-tier tools complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Deploy Kafka topics: kubectl apply -f k8s/minikube/kafka-deployment.yaml"
Write-Host "   2. Deploy Dapr components: kubectl apply -f dapr/components/"
Write-Host "   3. Deploy application: kubectl apply -f k8s/minikube/"