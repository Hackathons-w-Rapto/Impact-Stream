# StakeStream Backend

Backend API for the StakeStream project staking platform built on Umi Network.

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Swagger API Documentation

## Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root of the server directory:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/stakestream

# JWT Secret for Admin Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

3. Start development server:

```bash
npm run dev
```

## API Documentation

API documentation is available at `/api/docs` once the server is running.

## API Endpoints

### Public Endpoints

- `GET /api/projects` - List all projects with optional filtering
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/stake` - Create a stake intent
- `GET /api/projects/stakes/:address` - Get stakes by wallet address

### Admin Endpoints (Require Authentication)

- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Login admin
- `POST /api/admin/projects` - Create new project
- `GET /api/admin/projects` - Get admin's projects
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

## Umi Integration

The backend handles the submission of staking intents that are later executed on the Umi Network. This intent-based approach ensures:

- MEV protection for user stakes
- Gasless transactions for users
- Conditional execution based on specified rules
- Batch processing for efficiency 