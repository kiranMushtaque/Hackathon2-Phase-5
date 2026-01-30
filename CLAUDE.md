# CLAUDE.md: AI Operations Guide for Todo Chatbot Phase V

## Overview
This document provides AI-assisted operational guidance for managing the Todo Chatbot Phase V infrastructure using AIOps tools and AI command interfaces.

## AIOps Tools Reference

### 1. kubectl-ai
An AI-enhanced Kubernetes command-line interface that understands natural language queries.

**Installation**:
```bash
# Install kubectl-ai plugin
curl -LO https://github.com/your-org/kubectl-ai/releases/latest/download/kubectl-ai
chmod +x kubectl-ai
sudo mv kubectl-ai /usr/local/bin/
```

**Usage Examples**:
```bash
# Natural language queries
kubectl-ai "show me all pods in todo-chatbot namespace that are not running"
kubectl-ai "scale backend deployment to 3 replicas"
kubectl-ai "find pods consuming more than 500MB memory"
kubectl-ai "restart all pods in dapr-system namespace"
```

### 2. Gordon (AI DevOps Assistant)
An AI-powered DevOps assistant for infrastructure management.

**Capabilities**:
- Infrastructure provisioning
- Configuration management
- Monitoring and alerting
- Troubleshooting and remediation

**Usage Examples**:
```
Gordon: Deploy the Todo Chatbot application to Minikube
Gordon: Check for any failing services in the todo-chatbot namespace
Gordon: Scale the backend service based on current load
Gordon: Update Dapr components to the latest version
```

### 3. Helm-AI
AI-enhanced Helm chart management.

**Usage Examples**:
```bash
# AI-assisted chart creation
helm-ai create "todo-chatbot-chart" --describe "Todo Chatbot application with Dapr and Kafka"
helm-ai install "todo-chatbot" --chart "todo-chatbot-chart" --describe "Install with production settings"
helm-ai upgrade "todo-chatbot" --describe "Increase backend replicas to 3 and add monitoring"
```

## AI Command Prompts for Infrastructure Management

### Kubernetes Operations
```bash
# Deploy the entire Todo Chatbot stack
kubectl-ai "apply all manifests in k8s/minikube/ directory with proper sequencing"

# Monitor application health
kubectl-ai "show me the status of all deployments, services, and Dapr components in todo-chatbot namespace"

# Troubleshoot performance issues
kubectl-ai "find any pods with high CPU or memory usage in the todo-chatbot namespace and suggest optimizations"

# Scale resources based on demand
kubectl-ai "analyze current resource usage and recommend scaling for 1000 concurrent users"
```

### Dapr Operations
```bash
# Manage Dapr components
kubectl-ai "show all Dapr components and their status"
kubectl-ai "update kafka-pubsub component with new broker addresses"
kubectl-ai "restart all Dapr sidecars in todo-chatbot namespace"

# Monitor Dapr services
kubectl-ai "show Dapr sidecar logs for backend-service"
kubectl-ai "check Dapr service invocation between frontend and backend"
```

### Kafka Operations
```bash
# Monitor Kafka topics
kubectl-ai "show consumer lag for all Kafka topics in kafka namespace"
kubectl-ai "list all messages in task-events topic from last hour"
kubectl-ai "check if reminders topic has any unprocessed messages"

# Manage Kafka resources
kubectl-ai "increase partitions for task-events topic to 5"
kubectl-ai "create new Kafka topic for audit-logs with 3 partitions"
```

### Helm Operations
```bash
# Deploy with AI assistance
helm-ai install "todo-chatbot" --repo "https://your-repo/charts" --describe "Production deployment with TLS and monitoring"
helm-ai upgrade "todo-chatbot" --describe "Update to version 2.0 with new Kafka settings and increased resources"

# Rollback operations
helm-ai rollback "todo-chatbot" --describe "Revert to previous stable version due to performance issues"
```

## AI-Assisted Development Commands

### Generate Infrastructure Code
```
Gordon: Generate a Helm chart for the Todo Chatbot backend service with Dapr sidecar injection
Gordon: Create a Kubernetes deployment YAML for the frontend with proper resource limits
Gordon: Generate Dapr component configuration for PostgreSQL state store
Gordon: Create a Kafka topic configuration for reminders with proper retention settings
```

### Infrastructure Validation
```bash
# Validate configurations with AI
kubectl-ai "validate all YAML files in k8s/cloud/ for best practices and security issues"
kubectl-ai "check if Dapr components are properly configured for production"
kubectl-ai "review resource requests and limits for cost optimization"
```

### Monitoring and Alerting
```
Gordon: Set up monitoring for the Todo Chatbot application with Prometheus and Grafana
Gordon: Create alerts for high error rates in the backend service
Gordon: Configure dashboard for Kafka consumer lag monitoring
Gordon: Set up Dapr-specific monitoring and alerting
```

## AI-Powered Troubleshooting

### Common Issues and Solutions
```
Gordon: The backend service is not responding, diagnose and fix the issue
Gordon: Kafka consumers are lagging, identify the cause and recommend solutions
Gordon: Dapr sidecar is not starting, troubleshoot and resolve
Gordon: Frontend cannot connect to backend, debug the service invocation
```

### Performance Optimization
```
Gordon: Analyze current resource usage and suggest optimizations for cost reduction
Gordon: Identify bottlenecks in the event-driven architecture
Gordon: Recommend database indexing strategies for better performance
Gordon: Optimize Kafka topic configurations for throughput
```

## AI Command Templates

### Deployment Templates
```bash
# Standard deployment command
kubectl-ai "deploy todo-chatbot application to namespace todo-chatbot with Dapr enabled and Kafka connectivity"

# Blue-green deployment
kubectl-ai "perform blue-green deployment of backend service with zero downtime"

# Canary release
kubectl-ai "release new version of frontend as canary with 10% traffic"
```

### Scaling Templates
```bash
# Auto-scaling based on metrics
kubectl-ai "configure horizontal pod autoscaler for backend based on CPU and memory usage"

# Traffic-based scaling
kubectl-ai "scale services based on incoming request rate and response time"
```

### Security Templates
```bash
# Security scanning
kubectl-ai "scan all deployed images for vulnerabilities and report findings"

# RBAC configuration
kubectl-ai "generate RBAC roles for todo-chatbot services with minimal required permissions"
```

## Best Practices for AI Operations

1. **Always validate AI-generated commands** before applying to production
2. **Use dry-run options** when available to preview changes
3. **Maintain human oversight** for critical operations
4. **Document AI decisions** for audit and learning purposes
5. **Regularly update AI models** with latest best practices
6. **Implement proper access controls** for AI tools
7. **Monitor AI recommendations** for accuracy and relevance

## Integration with Existing Tools

The AI operations tools integrate seamlessly with:
- Standard Kubernetes tooling (kubectl, helm, kustomize)
- CI/CD pipelines (GitHub Actions, Jenkins)
- Monitoring stacks (Prometheus, Grafana, ELK)
- Cloud platforms (OCI, GCP, AWS)
- Dapr and other service mesh tools