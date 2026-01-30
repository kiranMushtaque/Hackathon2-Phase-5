# Kafka Infrastructure Specification for Todo Chatbot

## Overview
This specification defines the Kafka infrastructure requirements for the Todo Chatbot application, focusing on event-driven architecture patterns.

## Kafka Topics

### task-events Topic
- **Purpose**: Store all task lifecycle events
- **Partitions**: 3 (for parallel processing)
- **Replication Factor**: 1 (for local development), 3 (for production)
- **Retention**: 7 days (local), 30 days (production)
- **Schema**:
```json
{
  "event_type": "created|updated|completed|deleted|recurring-created",
  "task_id": "string, unique task identifier",
  "user_id": "string, user identifier",
  "task_data": {
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "priority": "low|medium|high",
    "tags": "array of strings",
    "due_date": "ISO datetime string",
    "created_at": "ISO datetime string",
    "updated_at": "ISO datetime string"
  },
  "timestamp": "ISO datetime string",
  "correlation_id": "string, for tracking related events"
}
```

### reminders Topic
- **Purpose**: Store reminder events for scheduled notifications
- **Partitions**: 3
- **Replication Factor**: 1 (local), 3 (production)
- **Retention**: 7 days
- **Schema**:
```json
{
  "event_type": "scheduled|sent|missed|cancelled",
  "reminder_id": "string, unique reminder identifier",
  "task_id": "string, associated task identifier",
  "user_id": "string, user identifier",
  "message": "string, reminder message",
  "scheduled_time": "ISO datetime string",
  "notification_method": "email|push|sms",
  "timestamp": "ISO datetime string",
  "correlation_id": "string"
}
```

### task-updates Topic
- **Purpose**: Store task update notifications for audit trail
- **Partitions**: 3
- **Replication Factor**: 1 (local), 3 (production)
- **Retention**: 30 days
- **Schema**:
```json
{
  "event_type": "field_updated|status_changed|priority_changed|tag_added|tag_removed",
  "task_id": "string, unique task identifier",
  "user_id": "string, user identifier",
  "field_changed": "string, name of field that changed",
  "previous_value": "any, previous value of the field",
  "new_value": "any, new value of the field",
  "changed_by": "string, user or system that made the change",
  "timestamp": "ISO datetime string",
  "correlation_id": "string"
}
```

## Kafka Configuration

### Local Development (Redpanda)
- **Bootstrap Servers**: localhost:9092
- **Consumer Group Prefix**: todo-chatbot-
- **Security Protocol**: PLAINTEXT (local only)
- **Batch Size**: 16384 bytes
- **Linger Ms**: 5 ms
- **Compression Type**: snappy

### Production (Cloud Kafka)
- **Bootstrap Servers**: Provided by cloud provider
- **Security Protocol**: SASL_SSL
- **Authentication**: SASL/SCRAM or SASL/IAM
- **Encryption**: TLS 1.2+
- **Network**: Private subnet access only

## Producer Requirements
- **Idempotent Production**: Enabled to prevent duplicate messages
- **Acknowledge All**: Require acknowledgment from all replicas
- **Retry Policy**: Exponential backoff with max 10 retries
- **Batching**: Enabled for improved throughput
- **Serialization**: JSON with schema validation

## Consumer Requirements
- **Consumer Groups**: Separate groups for different services
- **Offset Management**: Automatic commit with manual override capability
- **Error Handling**: Dead letter queue for failed messages
- **Concurrency**: Configurable number of consumer threads
- **Deserialization**: JSON with schema validation

## Dapr Integration
- **Component Name**: kafka-pubsub
- **Type**: pubsub.kafka
- **Metadata**:
  - brokers: Kafka broker addresses
  - consumerGroup: Consumer group identifier
  - authRequired: Authentication requirement flag
  - saslUsername/saslPassword: For SASL authentication
  - tlsEnabled: TLS encryption flag

## Event Sourcing Patterns
- **Event Store**: Immutable log of all task-related events
- **Projection**: Real-time views derived from event stream
- **Snapshotting**: Periodic snapshots for faster recovery
- **Replay Capability**: Ability to rebuild state from events

## Monitoring and Observability
- **Metrics**: Throughput, latency, consumer lag
- **Alerts**: Consumer lag thresholds, broker downtime
- **Logging**: Message flow and error tracking
- **Tracing**: End-to-end request tracing across services

## Security Requirements
- **Authentication**: SASL/SCRAM or SASL/IAM for cloud
- **Authorization**: ACLs to restrict topic access
- **Encryption**: TLS for data in transit, optional for data at rest
- **Auditing**: Log all administrative operations
- **Network Isolation**: Private network access only