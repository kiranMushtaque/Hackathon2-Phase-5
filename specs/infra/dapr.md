# Dapr Infrastructure Specification for Todo Chatbot

## Overview
This specification defines the Dapr (Distributed Application Runtime) infrastructure requirements for the Todo Chatbot application, focusing on building blocks for state management, pub/sub, service invocation, and secrets.

## Dapr Building Blocks

### 1. Service Invocation
- **Purpose**: Enable secure service-to-service communication
- **Component Type**: `dapr.io/actor` and direct invocation
- **Security**: Automatic mTLS encryption
- **Features**: Retry policies, circuit breakers, distributed tracing
- **Configuration**:
  - App ID: Unique identifier for each service
  - App Port: Port where the application listens
  - Protocol: HTTP/gRPC

### 2. State Management
- **Purpose**: Provide state management capabilities
- **Component Types**: 
  - `state.redis` for caching
  - `state.postgresql` for persistent storage
  - `state.etcd` for distributed coordination (alternative)
- **Features**: 
  - Transactional operations
  - ETags for concurrency control
  - TTL for automatic cleanup
  - Encryption at rest

### 3. Pub/Sub (Publish/Subscribe)
- **Purpose**: Enable event-driven architectures
- **Component Types**:
  - `pubsub.kafka` for Kafka integration
  - `pubsub.redis` for lightweight pub/sub (alternative)
  - `pubsub.rabbitmq` for RabbitMQ (alternative)
- **Features**:
  - At-least-once delivery
  - Topic-based routing
  - Message ordering (partitioned topics)
  - Dead letter queues

### 4. Secret Stores
- **Purpose**: Secure access to sensitive information
- **Component Types**:
  - `secretstores.kubernetes` for Kubernetes secrets
  - `secretstores.hashicorp.vault` for HashiCorp Vault
  - `secretstores.azure.keyvault` for Azure Key Vault (alternative)
- **Features**:
  - Dynamic secret rotation
  - Fine-grained access control
  - Audit logging

### 5. Bindings
- **Purpose**: Connect to external systems
- **Component Types**:
  - `bindings.cron` for scheduled tasks
  - `bindings.http` for HTTP endpoints
  - `bindings.mongodb` for MongoDB operations (alternative)
- **Features**:
  - Input and output bindings
  - Metadata configuration
  - Error handling and retry

## Dapr Components Configuration

### Kafka Pub/Sub Component
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka:9092"
  - name: consumerGroup
    value: "todo-chatbot"
  - name: clientID
    value: "todo-chatbot-app"
  - name: authRequired
    value: "false"
  - name: saslUsername
    value: "admin"
  - name: saslPassword
    secretKeyRef:
      name: kafka-secret
      key: password
```

### PostgreSQL State Store Component
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: postgres-secret
      key: connection-string
  - name: tableName
    value: "state_table"
  - name: schema
    value: "public"
  - name: actorStateStore
    value: "true"
```

### Kubernetes Secret Store Component
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secret-store
spec:
  type: secretstores.kubernetes
  version: v1
  metadata: []
```

## Dapr Sidecar Configuration

### Annotation Requirements
```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "backend-service"
  dapr.io/app-port: "8000"
  dapr.io/config: "dapr-config"
  dapr.io/log-level: "info"
  dapr.io/sidecar-cpu-limit: "0.5"
  dapr.io/sidecar-cpu-request: "0.1"
  dapr.io/sidecar-memory-limit: "512Mi"
  dapr.io/sidecar-memory-request: "256Mi"
```

### Configuration for Observability
```yaml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: dapr-config
spec:
  tracing:
    samplingRate: "1"
    zipkin:
      endpointAddress: "http://zipkin.default.svc.cluster.local:9411/api/v2/spans"
  metric:
    enabled: true
  httpPipeline:
    handlers:
    - name: validator
      type: middleware.http.validator
  features:
  - name: Feature1
    enabled: true
```

## Deployment Requirements

### Kubernetes Deployment with Dapr
- **Sidecar Injection**: Automatic via mutating webhook
- **Resource Limits**: CPU/memory requests and limits for sidecar
- **Security Context**: Non-root user execution
- **Health Checks**: Dapr sidecar health endpoints
- **Networking**: Service mesh integration

### Helm Chart Integration
- **Dapr Annotations**: Template-based annotation injection
- **Component Templates**: Parameterized Dapr component definitions
- **Configuration Values**: Configurable Dapr settings in values.yaml
- **Dependency Management**: Dapr as a dependency in Chart.yaml

## Security Requirements

### Authentication & Authorization
- **mTLS**: Automatic mutual TLS between services
- **SPIFFE IDs**: Secure identification of services
- **Access Control**: Granular permissions for service invocation
- **Certificate Rotation**: Automatic certificate renewal

### Encryption
- **Data in Transit**: TLS 1.2+ for all communications
- **Data at Rest**: Encrypted state stores (when supported)
- **Secrets Management**: Encrypted secret transmission

## Monitoring and Observability

### Metrics Collection
- **Built-in Metrics**: Dapr runtime metrics
- **Application Metrics**: Custom application metrics
- **Prometheus Integration**: Metrics endpoint exposure
- **Grafana Dashboards**: Pre-built dashboards for Dapr

### Distributed Tracing
- **Trace Context**: W3C Trace Context standard
- **Zipkin/Jaeger**: Integration with popular tracing systems
- **Span Propagation**: Across service boundaries
- **Sampling**: Configurable trace sampling rates

### Logging
- **Structured Logging**: JSON-formatted logs
- **Correlation IDs**: End-to-end request tracking
- **Log Levels**: Configurable verbosity
- **Centralized Logging**: Integration with ELK stack

## Performance Requirements

### Latency Targets
- **Service Invocation**: <10ms additional latency
- **State Operations**: <5ms for in-memory, <20ms for persistent
- **Pub/Sub**: <5ms publish, <10ms delivery

### Throughput Targets
- **Service Invocation**: 10,000+ requests/second
- **State Operations**: 5,000+ operations/second
- **Pub/Sub**: 100,000+ messages/second

### Resource Utilization
- **CPU**: <0.1 CPU request, <0.5 CPU limit per sidecar
- **Memory**: <128MB request, <512MB limit per sidecar
- **Network**: Efficient batching and compression