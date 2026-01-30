# Recurring Tasks Feature Specification

## Overview
This document defines the requirements for recurring tasks functionality in the Todo AI Chatbot. Users can create tasks that repeat on a schedule (daily, weekly, monthly) with customizable recurrence patterns.

## Data Model
### Recurring Task Entity
```python
{
  "id": "string, unique identifier",
  "title": "string, task title (max 255 chars)",
  "description": "string, optional task description",
  "completed": "boolean, task completion status",
  "user_id": "string, foreign key linking to user",
  "created_at": "datetime, timestamp when task was created",
  "updated_at": "datetime, timestamp when task was last updated",
  "is_recurring": "boolean, indicates if task is recurring",
  "recurrence_pattern": "string, recurrence frequency (daily|weekly|monthly)",
  "recurrence_interval": "integer, interval multiplier for pattern",
  "recurrence_end_date": "datetime, optional end date for recurrence",
  "next_occurrence": "datetime, when next instance will be created"
}
```

## API Endpoints

### POST `/api/{user_id}/recurring-tasks`
- **Description**: Create a new recurring task for the user
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "title": "string", 
    "description": "string", 
    "recurrence_pattern": "daily|weekly|monthly", 
    "recurrence_interval": 1,
    "recurrence_end_date": "ISO datetime string (optional)"
  }`
- **Response**:
  - 201: Created recurring task object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)

### GET `/api/{user_id}/recurring-tasks`
- **Description**: Retrieve all recurring tasks for a user
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 200: Array of recurring task objects
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: User not found

### PUT `/api/{user_id}/recurring-tasks/{task_id}`
- **Description**: Update a recurring task for the user
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "title": "string (optional)", 
    "description": "string (optional)", 
    "recurrence_pattern": "daily|weekly|monthly (optional)", 
    "recurrence_interval": "integer (optional)",
    "recurrence_end_date": "ISO datetime string (optional)"
  }`
- **Response**:
  - 200: Updated recurring task object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Task not found

### DELETE `/api/{user_id}/recurring-tasks/{task_id}`
- **Description**: Delete a recurring task for the user
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 204: Success (no content)
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Task not found

## Business Logic
1. When a recurring task is created, the system schedules future instances
2. Recurring tasks generate new task instances based on the recurrence pattern
3. Users can modify recurrence patterns which affects future instances only
4. Completed recurring task instances do not affect the recurring template
5. Deleting a recurring task stops future instances from being created
6. Recurring tasks can have an optional end date or be indefinite

## Recurrence Patterns
- **Daily**: Every day or every N days
- **Weekly**: Every week or every N weeks on the same weekday
- **Monthly**: Every month or every N months on the same day of month
- **Custom**: Complex patterns (future enhancement)

## Validation Rules
- Recurrence pattern must be one of: daily, weekly, monthly
- Recurrence interval must be a positive integer (default: 1)
- End date must be in the future if provided
- Title: Required, 1-255 characters
- Description: Optional, max 1000 characters
- All datetime fields use ISO 8601 format

## Event-Driven Architecture
- Creating a recurring task triggers a `recurring-task-created` event
- Updating a recurring task triggers a `recurring-task-updated` event
- Deleting a recurring task triggers a `recurring-task-deleted` event
- Each generated task instance triggers a `task-created` event

## Dapr Integration
- Recurring task schedules stored in Dapr state store
- Recurring task events published via Dapr pub/sub to Kafka
- Recurring task jobs managed via Dapr Jobs API