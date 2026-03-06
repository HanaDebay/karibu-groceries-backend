# Karibu Groceries LTD System - Backend API

This repository contains the backend API for the Karibu Groceries LTD System. It is a Node.js application built with Express, responsible for all business logic, data management, and authentication. It provides a complete set of RESTful endpoints to be consumed by a frontend client (e.g., the Vue.js application).

## Tech Stack
- Node.js + Express (backend API)
- MongoDB + Mongoose (database)
- JSON Web Tokens (JWT) for Authentication
- Swagger UI (API testing)

## Core Features
- Role-based access: Director, Manager, Sales Agent
- Procurement and stock management by branch
- Cash and credit sale recording
- Credit payment collection (partial/full payment)
- Sales, stock, and credit reporting dashboards
- Receipt printing for sales transactions

## Project Structure

- `/config`: Database connection and Swagger configuration.
- `/controllers`: Contains the business logic for each route.
- `/middlewares`: Custom middleware for authentication (JWT) and role checking.
- `/models`: Mongoose schemas defining the database structure.
- `/routes`: Express router definitions for all API endpoints.
- `seed.js`: A script to create the initial 'Director' user.
- `server.js`: The main entry point for the application.

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd karibu-groceries-system-backend
```

### 2. Install dependencies
```bash
npm install
```

### 2) Configure environment
Create/update `.env` in project root 
```env
DATABASE_URI=your_mongodb_connection_string
PORT=your_server_port
JWT_SECRET=your_secure_random_secret
```

### 3) Build Vue frontend
```bash
npm run build:vue
```

### 4) Start server
```bash
npm start
```

## Access URLs
- App (Vue): `http://localhost:7000/`
- Login: `http://localhost:7000/login`
- Swagger API docs: `http://localhost:7000/api-docs`

## NPM Scripts
- `npm start` - start backend server
- `npm run dev:vue` - run Vue dev server
- `npm run build:vue` - build Vue for production
- `npm run preview:vue` - preview Vue production build

## API Authentication
Most protected endpoints require Bearer token auth.
Use login endpoint first, then pass:
```http
Authorization: Bearer <token>
```
