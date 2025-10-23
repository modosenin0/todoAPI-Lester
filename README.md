# Todo API

A RESTful API built with Node.js and Express for managing todos.

## Your task

Create an API for managing a todo list with the following endpoints:

* `GET /v1/tasks` -> fetch and search for tasks
* `GET /v1/tasks/:taskId` -> fetch a specific task
* `POST /v1/tasks` -> create a task
* `PUT /v1/tasks/:taskId` -> update a task
* `DELETE /v1/tasks/:taskId` -> delete a task

You must:

* Store all data in memory - don't worry about persisting it
* Authenticate calls into the API using API keys
* Ensure your code is testable by following SOLID/TDD principals

For a bonus write atleast 1 unit test for your code.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### API Endpoints

- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint

## Project Structure

```
todoApi/
├── index.js          # Main application file
├── package.json      # Project dependencies
├── .gitignore        # Git ignore rules
└── README.md         # This file
```