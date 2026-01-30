# My Fullstack App

This project is a fullstack application that consists of a Next.js frontend, a FastAPI backend, and a PostgreSQL database. The application is designed to manage tasks intelligently using an AI chatbot interface.

## Project Structure

```
my-fullstack-app
├── frontend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── k8s
│   │   └── frontend-deployment.yaml
│   ├── src
│   │   ├── app
│   │   │   └── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── README.md
├── backend
│   ├── Dockerfile
│   ├── src
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
├── db
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## Frontend

The frontend is built using Next.js and is responsible for providing the user interface for interacting with the AI chatbot and managing tasks.

### Setup Instructions

1. Navigate to the `frontend` directory.
2. Run `npm install` to install the necessary dependencies.
3. Use `npm run build` to build the application.
4. Start the application using `npm start`.

### Docker

To build and run the frontend in Docker:

1. Ensure Docker is installed and running.
2. Navigate to the `frontend` directory.
3. Build the Docker image using:
   ```
   docker build -t frontend .
   ```
4. Run the Docker container using:
   ```
   docker run -p 3000:3000 frontend
   ```

## Backend

The backend is built using FastAPI and handles API requests from the frontend, including processing messages from the chatbot and interacting with the PostgreSQL database.

### Setup Instructions

1. Navigate to the `backend` directory.
2. Install the required dependencies using:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI application using:
   ```
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Docker

To build and run the backend in Docker:

1. Ensure Docker is installed and running.
2. Navigate to the `backend` directory.
3. Build the Docker image using:
   ```
   docker build -t backend .
   ```
4. Run the Docker container using:
   ```
   docker run -p 8000:8000 backend
   ```

## Database

The PostgreSQL database is initialized with the necessary schema and data using the `init.sql` file located in the `db` directory.

### Setup Instructions

1. Ensure PostgreSQL is installed and running.
2. Use the `init.sql` file to set up the database schema.

## Docker Compose

To run the entire application stack (frontend, backend, and database) using Docker Compose:

1. Navigate to the root of the project.
2. Run the following command:
   ```
   docker-compose up --build
   ```

## Kubernetes Deployment

To deploy the frontend to a Kubernetes cluster, use the `frontend-deployment.yaml` file located in the `frontend/k8s` directory. Ensure you have a Kubernetes cluster set up and configured.

## Verifying Event-Driven Functionality

To verify the event-driven functionality where the chatbot's message triggers task creation in the database via the backend, follow these steps:

1. **Send a Message**: Use the chat interface in the frontend to send a message to the `/api/chat` endpoint of the FastAPI backend.

2. **Backend Processing**: Ensure that the backend processes the message and triggers the logic to create a new task in the PostgreSQL database.

3. **Database Verification**: After sending the message, check the PostgreSQL database to confirm that a new task has been created. You can do this by querying the relevant table in the database.

4. **Logs and Debugging**: Monitor the logs of both the frontend and backend services to ensure that the message was received and processed correctly. Look for any errors or confirmation messages indicating successful task creation.

5. **Testing**: Optionally, implement automated tests that simulate sending messages and verify that tasks are created as expected in the database.