# Kafka Architecture Documentation

## Overview

The Todo AI Chatbot uses Apache Kafka as an event streaming platform to implement an event-driven architecture. Kafka enables loose coupling between services and provides reliable, scalable messaging for task events.

## Event Flow Diagram

```
[Frontend] --> [Backend] --> [Kafka via Dapr] --> [Event Consumers]
     |             |                                    |
     |             |-> Task Created Event               |-> Task Processor
     |             |-> Task Updated Event               |-> Notification Service
     |             |-> Task Completed Event             |-> Analytics Engine
     |             |-> Reminder Event                   |-> External Systems
```

## Kafka Topics

### 1. `task-events` Topic
- **Purpose**: Stores all task lifecycle events
- **Partitions**: 3 (for parallel processing)
- **Replication Factor**: 1 (for local development)
- **Retention**: 7 days

**Event Schema**:
```json
{
  "event_type": "created|updated|completed|deleted",
  "task_id": 123,
  "user_id": "user123",
  "task_data": {
    "title": "Task Title",
    "description": "Task Description",
    "due_date": "2026-01-27T10:00:00Z",
    "status": "pending|completed"
  },
  "timestamp": "2026-01-26T10:00:00Z"
}
```

### 2. `reminders` Topic
- **Purpose**: Stores reminder events for scheduled notifications
- **Partitions**: 3
- **Replication Factor**: 1
- **Retention**: 7 days

**Event Schema**:
```json
{
  "task_id": 123,
  "user_id": "user123",
  "remind_at": "2026-01-27T09:00:00Z",
  "task_title": "Buy groceries",
  "notification_method": "email|push|sms"
}
```

### 3. `task-updates` Topic
- **Purpose**: Stores task update notifications for audit trail
- **Partitions**: 3
- **Replication Factor**: 1
- **Retention**: 30 days

**Event Schema**:
```json
{
  "event_type": "field_updated",
  "task_id": 123,
  "user_id": "user123",
  "field_changed": "status|title|due_date",
  "previous_value": "old_value",
  "new_value": "new_value",
  "changed_by": "user|system",
  "timestamp": "2026-01-26T10:00:00Z"
}
```

## Producer Implementation

The backend service acts as a Kafka producer through Dapr's pub/sub building block:

1. **Event Creation**: When a user interacts with the chatbot, the backend creates appropriate events
2. **Dapr Integration**: Events are published to Kafka via Dapr's HTTP API
3. **Reliability**: Dapr handles retries and error handling

## Consumer Implementation

Potential consumers of Kafka events include:

1. **Task Processing Service**: Updates task state in the database
2. **Notification Service**: Sends email/SMS notifications
3. **Analytics Service**: Tracks user engagement and task patterns
4. **External Integrations**: Syncs tasks with third-party tools

## Benefits of Kafka Architecture

1. **Decoupling**: Services don't need direct knowledge of each other
2. **Scalability**: Multiple consumers can process events in parallel
3. **Reliability**: Event persistence ensures no data loss
4. **Flexibility**: New consumers can be added without changing producers
5. **Audit Trail**: All events are logged for compliance and analytics

## Configuration

Kafka is configured using Strimzi operators in Kubernetes:

- **Brokers**: Single broker for development, multiple for production
- **Topics**: Automatically created with defined partition and replication settings
- **Security**: Authentication and authorization configured via Strimzi