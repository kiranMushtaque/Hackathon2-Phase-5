# README for Backend

# My Fullstack App - Backend

This is the backend service for the My Fullstack App, built using FastAPI. It provides the necessary API endpoints to handle requests from the frontend and interact with the PostgreSQL database.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Docker (for containerization)
- PostgreSQL (for the database)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd my-fullstack-app/backend
   ```

2. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

### Running the Application

You can run the backend service using Docker:

1. Build the Docker image:

   ```
   docker build -t my-backend .
   ```

2. Run the Docker container:

   ```
   docker run -p 8000:8000 my-backend
   ```

Alternatively, you can run the application locally without Docker:

```
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### API Endpoints

- **POST /api/chat**: Sends a message to the chatbot and triggers task creation in the database.

### Database Initialization

The database schema and initial data can be set up using the `init.sql` file located in the `db` directory. This file will be executed when the PostgreSQL container starts.

### Testing

To test the API, you can use tools like Postman or curl to send requests to the endpoints.

### License

This project is licensed under the MIT License. See the LICENSE file for details.