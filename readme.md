
# 🗣️ Forum Backend API

A full-featured REST API for a forum/discussion platform built with **Node.js**, **Express**, and **MongoDB**. It includes features like authentication, posting, commenting, voting, validation, rate limiting, error handling, and Swagger/Scalar documentation.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Example API Requests](#-example-api-requests)
- [Security](#-security)
- [To Do](#-to-do)

---

## ✅ Features

- 🔐 User registration and login with JWT auth
- 📝 Create, update, delete posts
- 💬 Comment system with nested replies
- 👍 Voting system with upvotes/downvotes
- ✅ Data validation using `express-validator`
- 📉 Rate limiting on auth routes
- 📦 MongoDB integration with Mongoose
- 🧪 Custom error handling with centralized middleware
- 📄 API documentation using Scalar & Swagger
- 🛡 NoSQL injection and XSS protection using `helmet` and `express-mongo-sanitize`

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, express-mongo-sanitize, CORS
- **Documentation**: Swagger, Scalar
- **Rate Limiting**: express-rate-limit

---

## 🛠 Getting Started

```bash
git clone https://github.com/your-username/forum-backend.git
cd forum-backend
npm install
npm run start
```

## 🔐 Environment Variables
- PORT
- JWT_SECRET
- MONGO_URI
- MONGO_USERNAME
- MONGO_PASSWORD
- NODE_ENV

## 📁 Project Structure
```
.
├── Backend/
│   ├── config/
│   │   └── db.config.js
│   │   └── swagger.config.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── Routes/
│   ├── utils/
├── .env
├── server.js
├── package.json
└── README.md
```

## 📘 API Documentation
- Scalar -  http://localhost:4000/docs

## 🔁 Example API Requests
```
POST /forum/api/auth/register
Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourPassword",
  "role": "user"
},

POST /forum/api/post/create
Headers: Authorization: Bearer <token>
Body:
{
  "title": "First Post",
  "content": "This is my first post",
  "tags": ["introduction", "hello"]
}
```

## 🔐 Security
- helmet for setting secure HTTP headers

- express-mongo-sanitize to prevent NoSQL injections

- Input validation/sanitization via express-validator

- Rate limiting on auth routes

## TO DO 
- Add image upload for posts (Multer/Cloudinary)

- Add password reset/email verification

- Add admin panel & role-based access

- Write unit tests (Jest/Supertest)
