# Dynamic Question Assignment Dashboard

This project is a dynamic question assignment dashboard built with NestJS for the backend and React for the frontend. It allows users to create, manage, and view question assignments based on different regions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install the dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

3. Install the dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Set up your environment variables. Create a `.env` file in the backend directory and configure your MongoDB connection string and other necessary variables.

## Usage

1. Start the backend server:
   ```bash
   cd backend
   npm run start
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the dashboard.

## API Endpoints

### Question Assignments

- **GET** `/question-assignments/current-assignments` - Get current question assignments for all regions.
- **GET** `/question-assignments/upcoming-assignments` - Get upcoming question assignments.
- **POST** `/question-assignments/create` - Create a new question assignment.

### Questions

- **GET** `/questions` - Get all questions.
- **POST** `/questions` - Create a new question.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


High-Level System Architecture for a Scalable Application

To design a scalable social application capable of handling 100,000 daily active users (DAU) and scaling to support millions of global users, we need to consider several key components and best practices. Below is a high-level system architecture diagram along with an explanation of each component tailored for a mobile-centric application.

+-------------------+          +-------------------+
|   Mobile Clients   | <------> |   API Gateway     |
+-------------------+          +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Load Balancer   |
                             +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Microservices    |
                             | (User, Match, Chat,|
                             |  Notification, etc.)|
                             +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Message Queue    |
                             | (RabbitMQ, Kafka) |
                             +-------------------+
                                      |
                                      v
+-------------------+          +-------------------+
|   Relational DB   |          |   NoSQL DB        |
| (PostgreSQL)      |          | (MongoDB)         |
+-------------------+          +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Caching Layer    |
                             |      (Redis)      |
                             +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Monitoring &    |
                             |      Logging       |
                             +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Content Delivery |
                             |      Network       |
                             +-------------------+
                                      |
                                      v
                             +-------------------+
                             |   Global          |
                             |   Distribution    |
                             +-------------------+


## Architecture Diagram

```mermaid
graph TD
    A[Mobile Clients] -->|API Requests| B[CDN / Load Balancer]
    B --> C[API Gateway]
    C --> D[Authentication Service]
    C --> E[User Profile Service]
    C --> F[Matching Service]
    C --> G[Messaging Service]
    C --> H[Notification Service]
    D & E & F & G & H -->|Read/Write| I[Database Cluster]
    D & E & F & G & H -->|Cache| J[Caching Layer]
    D & E & F & G & H -->|Async Tasks| K[Message Queue]
    K --> L[Background Workers]
    M[Admin Dashboard] --> C
    N[Analytics Service] --> C
    O[Monitoring & Logging] --> C & D & E & F & G & H & I & J & K & L
