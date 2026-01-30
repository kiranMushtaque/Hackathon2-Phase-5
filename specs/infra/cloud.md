# Cloud Deployment Infrastructure Specification for Todo Chatbot

## Overview
This specification defines the cloud infrastructure requirements for deploying the Todo Chatbot application on free-tier eligible platforms (Oracle Cloud Always Free OKE and Google Cloud Free Tier GKE), including Kubernetes resources, networking, and service configuration.

## Cloud Platform Requirements

### Oracle Cloud Infrastructure (OCI) - Always Free Eligible
- **Compute**: 4 AMD-based VMs (1/8 OCPU each) with 24GB total memory
- **Kubernetes**: Oracle Container Engine for Kubernetes (OKE) with Always Free tier
- **Storage**: 2x 100GB block volumes
- **Networking**: Public and private subnets
- **Load Balancer**: 1 public load balancer (first 10 Mbps free)

### Google Cloud Platform (GCP) - Free Tier Eligible
- **Compute**: GKE Autopilot clusters with free tier limits
- **Storage**: 5 GB-months of multi-region storage
- **Networking**: Cloud Load Balancing with free tier limits
- **Operations**: 10 GB-months of Cloud Logging

## Kubernetes Resources

### Namespaces
- **Primary Namespace**: `todo-chatbot-prod` for production resources
- **Dapr Namespace**: `dapr-system` for Dapr runtime
- **Kafka Namespace**: `kafka` for Kafka/Redpanda resources
- **Monitoring Namespace**: `monitoring` for observability tools

### Deployments
- **Backend Deployment**:
  - Replicas: 2 (to ensure availability within free tier)
  - Resource Requests: 256Mi memory, 250m CPU
  - Resource Limits: 512Mi memory, 500m CPU
  - Health Checks: Liveness and readiness probes
  - Dapr Sidecar: Enabled with proper annotations

- **Frontend Deployment**:
  - Replicas: 2 (to ensure availability within free tier)
  - Resource Requests: 128Mi memory, 100m CPU
  - Resource Limits: 256Mi memory, 200m CPU
  - Dapr Sidecar: Optional (only if needed)

### Services
- **Backend Service**:
  - Type: ClusterIP
  - Port: 80 (internal), Target Port: 8000 (application)
  - Selector: Match backend deployment labels

- **Frontend Service**:
  - Type: LoadBalancer
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
- **Hostnames**: Production domain names
- **TLS**: Let's Encrypt certificates for HTTPS
- **Path Routing**: `/` for frontend, `/api` for backend

### Service Discovery
- **Internal DNS**: Cloud provider DNS for service discovery
- **Dapr Service Invocation**: Dapr-sidecar based service calls
- **Load Balancing**: Cloud-native load balancing

## Dapr Integration

### Dapr Sidecar Injection
- **Automatic Injection**: Enabled via namespace annotation
- **Configuration**: Per-pod annotations for Dapr settings
- **Resources**: Proper CPU/memory allocation for sidecar
- **Security**: mTLS enabled by default

### Dapr Components
- **State Store**: Cloud-managed PostgreSQL or Redis component
- **Pub/Sub**: Kafka component for event streaming
- **Secret Store**: Cloud provider secret store component
- **Bindings**: Any required binding components

## Kafka/Cloud Streaming Configuration

### Free-Tier Kafka Alternative (Redpanda Cloud)
- **Plan**: Free tier with 5 topics
- **Throughput**: Limited to free tier allowances
- **Persistence**: Managed storage
- **Topics**: Pre-created topics for application use

### Topic Configuration
- **Partitions**: Optimized for free tier limitations
- **Replication**: Minimum required for reliability
- **Retention**: Configured for cost efficiency

## Monitoring and Observability

### Resource Monitoring
- **Cloud Metrics**: Provider-native monitoring (OCI Metrics, GCP Operations Suite)
- **Prometheus**: Application and infrastructure metrics
- **Grafana**: Visualization dashboards
- **Dapr Dashboard**: Dapr-specific metrics and traces

### Logging
- **Centralized Logging**: Cloud provider logging solutions
- **Application Logs**: Structured JSON logs
- **Dapr Logs**: Sidecar and runtime logs
- **Audit Logs**: Security-relevant events

## Security Requirements

### Network Security
- **VPC Configuration**: Isolated virtual networks
- **Firewall Rules**: Restrictive inbound/outbound rules
- **Private Clusters**: Private Kubernetes nodes (where available)

### Identity and Access Management
- **RBAC Configuration**: Cloud-native role-based access control
- **Service Accounts**: Dedicated accounts for each service
- **Workload Identity**: Secure workload authentication

## Deployment Automation

### CI/CD Pipeline
- **GitHub Actions**: Automated deployment pipeline
- **Helm Charts**: Parameterized deployment configurations
- **Infrastructure as Code**: Terraform or similar for infrastructure

### Configuration Management
- **Values Files**: Environment-specific configurations
- **Secret Management**: Cloud provider secret management
- **Parameterization**: Configurable deployment options

## Cost Management

### Resource Optimization
- **Right-sizing**: Optimal resource allocation for free tier
- **Auto-scaling**: Horizontal pod autoscaling within limits
- **Scheduled Scaling**: Scale down during off-hours (if needed)

### Monitoring Costs
- **Budget Alerts**: Notifications for cost thresholds
- **Resource Quotas**: Limits to prevent unexpected charges
- **Usage Reports**: Regular review of resource consumption

## Disaster Recovery

### Backup Strategies
- **Database Backups**: Automated backups within free tier
- **Configuration Backup**: Version-controlled configurations
- **State Export**: Dapr state store snapshots

### Recovery Procedures
- **Quick Restore**: Automated restore procedures
- **Rollback Procedures**: Version rollback capabilities
- **Multi-region Considerations**: Within free tier allowances

## Performance Requirements

### SLA Targets
- **Availability**: 99.5% within free tier constraints
- **Latency**: <200ms response time for API calls
- **Throughput**: Sufficient capacity for expected load

### Scaling Considerations
- **Horizontal Scaling**: Within free tier limits
- **Vertical Scaling**: Resource optimization strategies
- **Load Distribution**: Geographic distribution (if needed)