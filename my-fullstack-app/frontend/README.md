# My Fullstack App Frontend

This is the frontend of the My Fullstack App, built using Next.js. It serves as the user interface for interacting with the application.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Docker (for containerization)
- Docker Compose (for managing multi-container applications)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-fullstack-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

You can run the application in development mode using the following command:
```
npm run dev
```

### Building the Docker Image

To build the Docker image for the frontend in standalone mode, run:
```
docker build -t frontend .
```

### Running with Docker Compose

To run the frontend along with the backend and PostgreSQL database, use Docker Compose:
```
docker-compose up
```

This will start all services defined in the `docker-compose.yml` file.

### Deployment

For deploying the frontend to a Kubernetes cluster, use the provided `k8s/frontend-deployment.yaml` file. You can apply the deployment with:
```
kubectl apply -f k8s/frontend-deployment.yaml
```

## Event-Driven Functionality

The application features an event-driven architecture where messages sent through the chatbot interface trigger task creation in the database. 

### Verification Steps

1. **Send a Message**: Use the chat interface to send a message to the backend.
2. **Check Backend Processing**: Ensure the backend processes the message and creates a task in the database.
3. **Database Verification**: Query the PostgreSQL database to confirm that the task has been created.
4. **Monitor Logs**: Check the logs of both frontend and backend services for any errors or confirmation messages.
5. **Automated Testing**: Implement tests to simulate message sending and verify task creation.

## License

This project is licensed under the MIT License. See the LICENSE file for details.