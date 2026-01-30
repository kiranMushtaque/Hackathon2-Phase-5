# Reminders Feature Specification

## Overview
This document defines the requirements for reminder functionality in the Todo AI Chatbot. Users can set reminders for tasks with various timing options and notification methods.

## Data Model
### Reminder Entity
```python
{
  "id": "string, unique identifier",
  "task_id": "string, reference to associated task",
  "user_id": "string, foreign key linking to user",
  "title": "string, reminder title (max 255 chars)",
  "message": "string, reminder message content",
  "scheduled_time": "datetime, when reminder should be triggered",
  "notification_method": "string, how to notify user (email|push|sms)",
  "created_at": "datetime, timestamp when reminder was created",
  "updated_at": "datetime, timestamp when reminder was last updated",
  "sent_at": "datetime, when reminder was actually sent (null if not sent)",
  "is_active": "boolean, whether reminder is still active",
  "recurring": "boolean, whether this is a recurring reminder",
  "timezone": "string, timezone for scheduling (default: user's timezone)"
}
```

## API Endpoints

### POST `/api/{user_id}/reminders`
- **Description**: Create a new reminder for a task
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "task_id": "string", 
    "message": "string", 
    "scheduled_time": "ISO datetime string", 
    "notification_method": "email|push|sms (default: push)",
    "recurring": "boolean (default: false)",
    "timezone": "string (default: user's timezone)"
  }`
- **Response**:
  - 201: Created reminder object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Task not found

### GET `/api/{user_id}/reminders`
- **Description**: Retrieve all reminders for a user
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Query Parameters**:
  - `active_only`: boolean, return only active reminders (default: false)
  - `upcoming_only`: boolean, return only upcoming reminders (default: false)
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 200: Array of reminder objects
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: User not found

### GET `/api/{user_id}/reminders/{reminder_id}`
- **Description**: Retrieve a specific reminder
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 200: Single reminder object
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Reminder not found

### PUT `/api/{user_id}/reminders/{reminder_id}`
- **Description**: Update a reminder
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "message": "string (optional)", 
    "scheduled_time": "ISO datetime string (optional)", 
    "notification_method": "email|push|sms (optional)",
    "recurring": "boolean (optional)"
  }`
- **Response**:
  - 200: Updated reminder object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Reminder not found

### DELETE `/api/{user_id}/reminders/{reminder_id}`
- **Description**: Delete a reminder
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 204: Success (no content)
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Reminder not found

## Business Logic
1. Reminders are tied to specific tasks but can exist without a task
2. Users can have multiple reminders for the same task
3. Reminders can be scheduled in the past (will be marked as missed)
4. Recurring reminders follow the same pattern as recurring tasks
5. Reminders are automatically deactivated after being sent
6. Users can snooze reminders for a specified period

## Notification Methods
- **Push**: Mobile/web push notifications
- **Email**: Email notifications to user's registered email
- **SMS**: SMS notifications to user's registered phone number

## Timing Options
- **Absolute**: Specific date/time
- **Relative**: X minutes/hours/days before task due date
- **Recurring**: Repeating schedule (daily, weekly, etc.)

## Validation Rules
- Scheduled time must be in the future (for active reminders)
- Notification method must be one of: email, push, sms
- Message: Required, 1-500 characters
- Task ID: Required if associating with a task
- All datetime fields use ISO 8601 format

## Event-Driven Architecture
- Creating a reminder triggers a `reminder-created` event
- Sending a reminder triggers a `reminder-sent` event
- Missing a reminder triggers a `reminder-missed` event
- Cancelling a reminder triggers a `reminder-cancelled` event

## Dapr Integration
- Reminder schedules stored in Dapr state store
- Reminder events published via Dapr pub/sub to Kafka
- Reminder jobs managed via Dapr Jobs API
- Notification services invoked via Dapr service invocation