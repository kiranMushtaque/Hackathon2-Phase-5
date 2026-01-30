# Dapr Guide

## Overview

Distributed Application Runtime (Dapr) is a portable, event-driven runtime that simplifies building resilient, stateful, and serverless applications. In the Todo AI Chatbot, Dapr provides essential building blocks that abstract away distributed systems challenges.

## Dapr Building Blocks Used

### 1. Service-to-Service Invocation
- **Component**: Dapr sidecar proxies
- **Purpose**: Secure, reliable communication between frontend and backend
- **Benefits**: Automatic mTLS, retries, circuit breaking, and distributed tracing

### 2. State Management
- **Component**: PostgreSQL state store
- **Purpose**: Persist task data and user sessions
- **Benefits**: Consistent, durable storage with transaction support

### 3. Pub/Sub Messaging
- **Component**: Kafka pub/sub
- **Purpose**: Event-driven communication between services
- **Benefits**: Loose coupling, scalability, and reliability

## Component Configurations

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
    value: "todo-service"
  - name: authRequired
    value: "false"
```

**Purpose**: Enables services to publish and subscribe to events via Kafka.

### PostgreSQL State Store Component
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: postgres-state
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    value: "host=postgres-service port=5432 user=user password=password dbname=todo_db sslmode=disable"
  - name: table
    value: "state_table"
  - name: schema
    value: "public"
```

**Purpose**: Provides state management capabilities using PostgreSQL as the backing store.

## Dapr Sidecar Injection

Each service in the Kubernetes deployment includes Dapr sidecar annotations:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "backend-service"
        dapr.io/app-port: "8000"
```

**Benefits**:
- Transparent proxy for service invocation
- Automatic certificate rotation for mTLS
- Built-in observability and tracing
- Zero-code microservice patterns

## Why Dapr is Beneficial

### 1. Developer Productivity
- **Language Agnostic**: Works with any programming language
- **SDK Support**: Available SDKs for popular languages
- **Consistent APIs**: Same patterns regardless of infrastructure

### 2. Operational Excellence
- **Observability**: Built-in metrics, tracing, and logging
- **Security**: Automatic mTLS and secret management
- **Resilience**: Retry policies, circuit breakers, and timeouts

### 3. Infrastructure Abstraction
- **Portable**: Runs on any Kubernetes, VM, or bare metal
- **Pluggable Components**: Swap implementations without code changes
- **Cloud Native**: Integrates with existing cloud services

### 4. Event-Driven Architecture Support
- **Pub/Sub**: Multiple message brokers supported
- **Bindings**: Connect to external systems
- **Workflow**: Long-running stateful processes

## Integration with Kafka

Dapr simplifies Kafka integration by:

1. **Abstracting Complexity**: No need to manage Kafka clients directly
2. **Providing Guarantees**: At-least-once delivery semantics
3. **Enabling Patterns**: Supporting event-driven microservice patterns
4. **Managing Configuration**: Centralized component configuration

## Security Features

### Service Invocation Security
- Automatic mTLS encryption between services
- Service principals and identity management
- Access control policies

### Secret Management
- Secure storage and retrieval of secrets
- Integration with cloud key vaults
- Automatic rotation capabilities

## Monitoring and Observability

Dapr provides built-in observability features:

- **Metrics**: Prometheus-compatible metrics for Dapr building blocks
- **Tracing**: Distributed tracing with Zipkin/Jaeger integration
- **Logging**: Structured logging for debugging and monitoring

## Best Practices Implemented

1. **Component Separation**: Different components for different concerns
2. **Configuration Management**: Environment-specific configurations
3. **Health Checks**: Dapr-sidecar health monitoring
4. **Resource Limits**: Proper resource allocation for sidecars
5. **Security First**: Default mTLS and principle of least privilege