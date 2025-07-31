# Access Flow - Backend

This is the backend server for the **Access Flow** app, built with **Node.js**, **Express**, and **MongoDB**. It handles user authentication via **JWT**, sets secure cookies, and manages protected API routes.

---

## 🧠 Author - Aditya Prasad

- [LinkedIn]("https://www.linkedin.com/in/aditya-prasad-095ab9329/")
- [GitHub]("https://github.com/blueberry-adii)

---

## 🚀 Features

- 🔐 Login, Register, Logout routes
- 🍪 JWT set as **HTTP-only cookies**
- 🛡️ Auth middleware to protect routes
- 🧾 Basic user schema (email, password)
- 🎯 CORS, cookie-parser, dotenv, and express JSON setup

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB / Mongoose**
- **JWT**
- **dotenv**
- **cookie-parser**
- **CORS**

---

## 📦 API Endpoints

| Route              | Method | Description                       |
| ------------------ | ------ | --------------------------------- |
| `/api/auth/signup` | POST   | Register a new user               |
| `/api/auth/login`  | POST   | Authenticate user                 |
| `/api/auth/logout` | POST   | Remove token cookie               |
| `/api/user/me`     | GET    | Get current user if authenticated |

---

## 🔐 Auth Flow

1. On login/register, JWT is generated and sent as **HTTP-only cookie**.
2. Protected routes use middleware to validate token.
3. Logout endpoint clears the cookie.

---

## 🔧 Setup Instructions

1. **Clone the repo:**

```bash
git clone https://github.com/blueberry-adii/accessflow-backend.git

cd access-flow-backend

npm install

npm start
```
