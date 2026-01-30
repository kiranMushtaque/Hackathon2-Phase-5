# deploy-cloud.ps1
# Script to deploy the application to cloud (Oracle Cloud Always Free OKE) using free-tier tools

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("oke", "gke-free")]
    [string]$Platform,

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "todo-resource-group",

    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "todo-cluster"
)

Write-Host "🚀 Starting cloud deployment to $Platform (free tier)..." -ForegroundColor Green

# Validate platform
switch ($Platform) {
    "oke" {
        Write-Host "📋 Preparing for Oracle Cloud Always Free OKE deployment..." -ForegroundColor Yellow
        
        # Check if OCI CLI is installed
        if (!(Get-Command oci -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Oracle Cloud Infrastructure CLI is not installed. Please install OCI CLI first." -ForegroundColor Red
            exit 1
        }
        
        # Login to Oracle Cloud (this assumes you've already logged in or have config set up)
        Write-Host "🔄 Verifying Oracle Cloud authentication..." -ForegroundColor Yellow
        $oci_config = oci setup repair-file-permissions 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Not authenticated to Oracle Cloud. Please configure OCI CLI first." -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ Oracle Cloud authentication verified" -ForegroundColor Green
        
        # Get OKE cluster credentials
        Write-Host "🔄 Getting OKE cluster credentials..." -HorizontalAlignment Left -ForegroundColor Yellow
        oci ce cluster create-kubeconfig --cluster-id $ClusterName --file $env:USERPROFILE\.kube\config --region us-phoenix-1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to get OKE cluster credentials" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ OKE cluster credentials configured" -ForegroundColor Green
    }
    
    "gke-free" {
        Write-Host "📋 Preparing for Google Cloud Free Tier GKE deployment..." -ForegroundColor Yellow
        
        # Check if gcloud CLI is installed
        if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Google Cloud CLI is not installed. Please install gcloud CLI first." -ForegroundColor Red
            exit 1
        }
        
        # Authenticate to Google Cloud (this assumes you've already configured credentials)
        Write-Host "🔄 Verifying Google Cloud authentication..." -ForegroundColor Yellow
        $gcloud_config = gcloud config configurations list --quiet 2>$null
        if (!$gcloud_config) {
            Write-Host "❌ Not authenticated to Google Cloud. Please configure gcloud first." -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ Google Cloud authentication verified" -ForegroundColor Green
        
        # Get GKE credentials (using free tier eligible cluster)
        Write-Host "🔄 Getting GKE credentials..." -ForegroundColor Yellow
        gcloud container clusters get-credentials $ClusterName --zone us-central1-a --project $ResourceGroup
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to get GKE credentials" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ GKE credentials configured" -ForegroundColor Green
    }
}

# Verify kubectl connection
Write-Host "🔄 Verifying kubectl connection..." -ForegroundColor Yellow
kubectl cluster-info

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to connect to cluster" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Connected to cluster" -ForegroundColor Green

# Install Dapr if not already installed
Write-Host "🔄 Checking Dapr installation..." -ForegroundColor Yellow
$dapr_status = kubectl get pods -n dapr-system --no-headers 2>$null
if (!$dapr_status) {
    Write-Host "📦 Installing Dapr..." -ForegroundColor Yellow
    dapr init -k
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Dapr" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dapr installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dapr is already installed" -ForegroundColor Green
}

# Create Kafka namespace if it doesn't exist
Write-Host "🔄 Creating Kafka namespace..." -ForegroundColor Yellow
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

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

Write-Host "⏳ Waiting for Redpanda to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=redpanda -n kafka --timeout=600s

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Redpanda failed to become ready" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Redpanda is ready" -ForegroundColor Green

# Create secrets (these would typically come from Key Vault or similar)
Write-Host "🔄 Creating secrets..." -ForegroundColor Yellow
kubectl create namespace todo-app --dry-run=client -o yaml | kubectl apply -f -

# Note: In a real deployment, you would retrieve these from a secure store
if (!(kubectl get secret openai-secret -n todo-app --ignore-not-found=true)) {
    kubectl create secret generic openai-secret --from-literal=api-key=$env:OPENAI_API_KEY -n todo-app
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
kubectl apply -f ../k8s/cloud/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy application" -ForegroundColor Red
    exit 1
}

Write-Host "⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=Ready pod -l app=backend -n todo-app --timeout=600s
kubectl wait --for=condition=Ready pod -l app=frontend -n todo-app --timeout=600s

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployments failed to become ready" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Application deployments are ready" -ForegroundColor Green

# Display service information
Write-Host "`n📋 Service Information:" -ForegroundColor Cyan
kubectl get svc -n todo-app

Write-Host "`n🎉 Cloud deployment to $Platform (free tier) complete!" -ForegroundColor Green
Write-Host "💡 Remember to monitor your resource usage to stay within free tier limits."