# Advanced Task Features Specification

## Overview
This document defines the requirements for advanced task management features in the Todo AI Chatbot: priorities, tags, search, filter, and sort functionality.

## Data Model
### Enhanced Task Entity
```python
{
  "id": "integer, auto-incrementing primary key",
  "title": "string, task title (max 255 chars)",
  "description": "string, optional task description",
  "completed": "boolean, task completion status",
  "user_id": "integer, foreign key linking to user",
  "created_at": "datetime, timestamp when task was created",
  "updated_at": "datetime, timestamp when task was last updated",
  "priority": "string, task priority (low|medium|high)",
  "tags": "array of strings, custom tags for categorization",
  "due_date": "datetime, optional due date for the task",
  "estimated_duration": "integer, estimated time to complete in minutes",
  "actual_duration": "integer, actual time taken to complete in minutes"
}
```

## API Endpoints

### GET `/api/{user_id}/tasks`
- **Description**: Retrieve all tasks for a user with advanced filtering, sorting, and search
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Query Parameters**:
  - `search`: string, search term to match in title or description
  - `priority`: string, filter by priority (low|medium|high)
  - `tag`: string, filter by specific tag
  - `completed`: boolean, filter by completion status
  - `due_before`: ISO date string, filter tasks due before date
  - `due_after`: ISO date string, filter tasks due after date
  - `sort_by`: string, sort field (title|created_at|due_date|priority|completed)
  - `sort_order`: string, sort direction (asc|desc) (default: desc)
  - `page`: integer, page number for pagination (default: 1)
  - `limit`: integer, number of items per page (default: 50, max: 100)
- **Request**:
  - Headers: `Authorization: Bearer {token}`
- **Response**:
  - 200: Paginated array of task objects with metadata
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: User not found

### POST `/api/{user_id}/tasks`
- **Description**: Create a new task with advanced properties
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "title": "string", 
    "description": "string", 
    "priority": "low|medium|high (default: medium)",
    "tags": "array of strings (default: [])",
    "due_date": "ISO datetime string (optional)",
    "estimated_duration": "integer (optional)"
  }`
- **Response**:
  - 201: Created task object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)

### PUT `/api/{user_id}/tasks/{task_id}`
- **Description**: Update a task with advanced properties
- **Authentication**: JWT token required
- **Authorization**: User must match the {user_id} in URL
- **Request**:
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ 
    "title": "string (optional)", 
    "description": "string (optional)", 
    "priority": "low|medium|high (optional)",
    "tags": "array of strings (optional)",
    "due_date": "ISO datetime string (optional)",
    "estimated_duration": "integer (optional)",
    "actual_duration": "integer (optional)"
  }`
- **Response**:
  - 200: Updated task object
  - 400: Invalid request body
  - 401: Unauthorized
  - 403: Forbidden (user mismatch)
  - 404: Task not found

## Feature Specifications

### Priorities
- **Values**: low, medium, high
- **Default**: medium
- **UI Indicators**: Color-coded badges or icons
- **Sorting**: High priority first when sorting by priority

### Tags
- **Format**: Strings with 1-50 characters
- **Limit**: Up to 10 tags per task
- **Validation**: Alphanumeric, hyphens, and underscores only
- **Case Sensitivity**: Tags are case-insensitive
- **Uniqueness**: Per-user tag names should be unique

### Search
- **Fields**: Searches in title and description
- **Algorithm**: Full-text search with fuzzy matching
- **Wildcards**: Support for wildcard characters (*)
- **Operators**: AND, OR, NOT logical operators
- **Performance**: Results returned within 500ms

### Filter
- **Priority Filter**: Filter tasks by priority level
- **Tag Filter**: Filter tasks by one or more tags
- **Completion Filter**: Show completed, incomplete, or all tasks
- **Date Range Filter**: Filter by due date range
- **Combined Filters**: Multiple filters can be applied together

### Sort
- **Available Fields**: title, created_at, due_date, priority, completed
- **Order**: Ascending or descending
- **Default**: Sort by created_at (descending)
- **Multi-sort**: Primary and secondary sort options

## Business Logic
1. Tasks inherit default priority if none specified
2. Tags are normalized (lowercase, trimmed) before storage
3. Search is case-insensitive
4. Filters are combined with AND logic
5. Sorting is stable (secondary sort by ID for equal values)
6. Pagination preserves sort order

## Validation Rules
- Priority: Must be one of low, medium, high
- Tags: Array of 1-10 strings, each 1-50 chars, alphanumeric with hyphens/underscores
- Due date: Must be in ISO 8601 format, can be in past or future
- Estimated duration: Positive integer in minutes (max: 524288 minutes ~364 days)
- Search term: Max 255 characters
- All datetime fields use ISO 8601 format

## Event-Driven Architecture
- Creating a task with tags/priority triggers enhanced `task-created` event
- Updating task properties triggers `task-updated` event with property changes
- Filtering/sorting operations generate `search-performed` events for analytics

## Dapr Integration
- Advanced task properties stored in Dapr state store
- Search indexes maintained via Dapr state management
- Filter/sort operations optimized through Dapr component integration