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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.