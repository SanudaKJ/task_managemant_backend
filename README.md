# Task Management System — Backend

Backend API for the Task Management System built using **Express.js**, **TypeScript**, and **MongoDB**.

This API handles authentication, authorization, and task management operations.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Password Security:** bcrypt
- **Deployment:** Render

---

## 🌐 Live API

Backend URL:

https://task-managemant-backend.onrender.com

---

## 📦 Features

- User Register
- User Login
- JWT Authentication
- Protected Routes
- Task CRUD Operations
- CORS Configuration
- Error Handling Middleware
- MongoDB Integration

---


## 🔐 Authentication Flow

1. User registers with email & password.
2. Password is hashed using bcrypt.
3. User logs in with credentials.
4. Backend generates JWT token.
5. Protected routes require valid JWT.

---


## ⚙️ Environment Variables

Create a `.env` file in root:




MONGO_URI= "Add mongoDB connection string"

JWT_SECRET= "Add secret key"

JWT_ACCESS_SECRET= "Add secret key"

JWT_REFRESH_SECRET= "Add secret key"

ACCESS_TOKEN_EXPIRES= "Add Time"

REFRESH_TOKEN_EXPIRES= "Add Time"

CLIENT_URL= 'Add backend URL'


---

## 🧑‍💻 Local Development

### 1. Clone repository

```bash
git clone https://github.com/SanudaKJ/task_managemant_backend.git

cd task_managemant_backend

Install dependencies: npm install

Build TypeScript :npm run build

Run server : npm start

Server runs on: http://localhost:5000