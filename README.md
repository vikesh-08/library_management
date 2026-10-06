# 📚 Library Management System

Full-stack Library Management System built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 🗂 Project Structure

```
Libary Maanagemt/
├── backend/      ← Node.js + Express + MongoDB API
└── frontend/     ← React (Vite) Application
```

---

## ⚙️ Setup Instructions

### 1. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. Click **Connect → Drivers** and copy the connection string
3. **Important**: In the MongoDB Atlas dashboard, go to **Network Access** -> **IP Access List**.
   - Click **Add IP Address**.
   - In the **Access List Entry** box, type: `0.0.0.0/0`
   - This ensures your connection won't break if your local IP changes.
4. Open `backend/.env` and replace the `MONGO_URI` with your connection string:

```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/librarydb?retryWrites=true&w=majority
JWT_SECRET=any_long_random_secret_here
PORT=5000
```

---

### 2. Start the Backend

```bash
cd backend
npm install        # (already done, but safe to re-run)
npm run seed       # ← Seeds DB with admin + 10 users + 10 books
npm run dev        # ← Starts server on http://localhost:5000
```

---

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install        # (already done, but safe to re-run)
npm run dev        # ← Starts app on http://localhost:5173
```

Open your browser at: **http://localhost:5173**

---

## 🔑 Default Login Credentials

| Role  | Username   | Password    |
|-------|-----------|-------------|
| Admin | `admin`   | `admin123`  |
| User  | `user1`   | `user1pass` |
| User  | `user2`   | `user2pass` |
| ...   | ...       | ...         |
| User  | `user10`  | `user10pass`|

---

## 🌟 Features

### Admin
- ✅ View all users
- ✅ Add new users
- ✅ Block / Unblock users
- ✅ Delete users
- ✅ Add / Edit / Delete books

### All Users
- ✅ View book catalog
- ✅ Search books by title or author
- ✅ Filter by category
- ✅ View book details
- ✅ Dashboard with stats

---

## 🔌 API Endpoints

| Method | Endpoint                  | Access     |
|--------|--------------------------|------------|
| POST   | `/api/auth/login`        | Public     |
| GET    | `/api/auth/me`           | Private    |
| GET    | `/api/users`             | Admin      |
| POST   | `/api/users`             | Admin      |
| PUT    | `/api/users/block/:id`   | Admin      |
| DELETE | `/api/users/:id`         | Admin      |
| GET    | `/api/books`             | Private    |
| GET    | `/api/books/:id`         | Private    |
| POST   | `/api/books`             | Admin      |
| PUT    | `/api/books/:id`         | Admin      |
| DELETE | `/api/books/:id`         | Admin      |
