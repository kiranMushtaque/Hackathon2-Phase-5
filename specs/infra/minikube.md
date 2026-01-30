# Minikube Infrastructure Specification for Todo Chatbot

## Overview
This specification defines the Minikube infrastructure requirements for deploying the Todo Chatbot application locally, including Kubernetes resources, networking, and service configuration.

## Infrastructure Requirements

### Minikube Configuration
- **Minimum Resources**:
  - CPU: 4 cores
  - Memory: 8GB RAM
  - Disk: 20GB available space
- **Driver**: VirtualBox, Hyper-V, or Docker (depending on OS)
- **Kubernetes Version**: v1.25 or higher
- **Addon Requirements**:
  - ingress: For external access
  - metrics-server: For resource monitoring
  - dashboard: For cluster visualization (optional)

### Storage Requirements
- **Persistent Volumes**: For database and state storage
- **Dynamic Provisioning**: Storage class for automatic volume creation
- **Volume Types**: HostPath for local development, cloud providers for production

## Kubernetes Resources

### Namespaces
- **Primary Namespace**: `todo-chatbot` for application resources
- **Dapr Namespace**: `dapr-system` for Dapr runtime
- **Monitoring Namespace**: `monitoring` for observability tools (optional)
- **Kafka Namespace**: `kafka` for Kafka/Redpanda resources

### Deployments
- **Backend Deployment**:
  - Replicas: 1 (local), 3+ (production)
  - Resource Requests: 256Mi memory, 250m CPU
  - Resource Limits: 512Mi memory, 500m CPU
  - Health Checks: Liveness and readiness probes
  - Dapr Sidecar: Enabled with proper annotations

- **Frontend Deployment**:
  - Replicas: 1 (local), 2+ (production)
  - Resource Requests: 128Mi memory, 100m CPU
  - Resource Limits: 256Mi memory, 200m CPU
  - Dapr Sidecar: Optional (only if needed)

### Services
- **Backend Service**:
  - Type: ClusterIP
  - Port: 80 (internal), Target Port: 8000 (application)
  - Selector: Match backend deployment labels

- **Frontend Service**:
  - Type: LoadBalancer (local), ClusterIP (production with ingress)
  - Port: 80, Target Port: 3000
  - Selector: Match frontend deployment labels

### ConfigMaps and Secrets
- **Application ConfigMap**: Non-sensitive configuration
- **Database Secret**: Connection strings and credentials
- **API Keys Secret**: Third-party service credentials
- **Dapr Configuration**: Dapr runtime settings

## Networking Configuration

### Ingress Controller
- **Controller**: NGINX Ingress Controller
- **Hostnames**: `todo.local`, `api.todo.local`
- **TLS**: Self-signed certificates for local development
- **Path Routing**: `/` for frontend, `/api` for backend

### Service Discovery
- **Internal DNS**: Kubernetes DNS for service discovery
- **Dapr Service Invocation**: Dapr-sidecar based service calls
- **Load Balancing**: Round-robin distribution

## Dapr Integration

### Dapr Sidecar Injection
- **Automatic Injection**: Enabled via namespace annotation
- **Configuration**: Per-pod annotations for Dapr settings
- **Resources**: Proper CPU/memory allocation for sidecar
- **Security**: mTLS enabled by default

### Dapr Components
- **State Store**: Redis or PostgreSQL component configuration
- **Pub/Sub**: Kafka component for event streaming
- **Secret Store**: Kubernetes secret store component
- **Bindings**: Any required binding components

## Kafka/Redpanda Configuration

### Local Kafka Alternative (Redpanda)
- **Deployment**: Single-node Redpanda cluster
- **Resources**: 1 CPU, 2GB memory
- **Persistence**: Local storage for data durability
- **Topics**: Pre-created topics for application use

### Topic Configuration
- **Partitions**: 3 partitions for each topic (local)
- **Replication**: 1 replica for local, 3 for production
- **Retention**: 7-day retention for local development

## Monitoring and Observability

### Resource Monitoring
- **Metrics Server**: Kubernetes resource metrics
- **Prometheus**: Application and infrastructure metrics
- **Grafana**: Visualization dashboards
- **Dapr Dashboard**: Dapr-specific metrics and traces

### Logging
- **Centralized Logging**: ELK or similar stack
- **Application Logs**: Structured JSON logs
- **Dapr Logs**: Sidecar and runtime logs
- **Audit Logs**: Security-relevant events

## Security Requirements

### Network Policies
- **Restrictive Policies**: Limit inter-pod communication
- **Namespace Isolation**: Separate network segments
- **Egress Control**: Restrict outbound connections

### RBAC Configuration
- **Service Accounts**: Dedicated accounts for each service
- **Role Definitions**: Minimal required permissions
- **Pod Security Standards**: Enforce security policies

## Deployment Automation

### Helm Charts
- **Application Chart**: Complete application deployment
- **Dapr Chart**: Dapr runtime installation
- **Kafka Chart**: Kafka/Redpanda deployment
- **Monitoring Chart**: Observability stack

### Configuration Management
- **Values Files**: Environment-specific configurations
- **Secret Management**: Secure credential handling
- **Parameterization**: Configurable deployment options

## Local Development Features

### Port Forwarding
- **Backend Access**: Port 8000 for direct API access
- **Frontend Access**: Port 3000 for UI development
- **Dapr Dashboard**: Port 8080 for Dapr management
- **Kafka UI**: Port 8081 for topic management

### Hot Reloading
- **Code Changes**: Automatic reload on file changes
- **Configuration**: Dynamic configuration updates
- **Dapr Components**: Reload without restart

## Backup and Recovery

### Local Backups
- **Database Dumps**: Periodic backup of PostgreSQL data
- **Configuration Backup**: Version-controlled configurations
- **State Export**: Dapr state store snapshots

### Disaster Recovery
- **Quick Restore**: Automated restore procedures
- **Rollback Procedures**: Version rollback capabilities
- **Data Recovery**: Point-in-time recovery options