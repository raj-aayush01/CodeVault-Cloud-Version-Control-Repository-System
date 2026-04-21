# 🚀 CodeVault – Cloud Version Control System

A GitHub-like version control system built from scratch using the MERN stack.  
CodeVault allows users to create repositories, manage files, follow users, and track project activity.

---

## 🌟 Features

### 🔐 Authentication
- User signup & login (JWT-based)
- Protected routes
- Persistent login using localStorage

### 👤 User System
- Profile page
- Follow / unfollow users
- Followers & following count

### 📦 Repository Management
- Create repositories (public/private)
- View repositories
- Explore repositories from other users

### 📂 File Management
- Upload and fetch repository files (via AWS S3)
- View file content
- Latest commit file listing

### 🔁 Version Control (Core Logic)
- Implemented basic VCS commands:
  - init
  - add
  - commit
  - push
  - pull
  - revert

### ⭐ UI/UX
- GitHub-inspired UI
- Dark theme
- Tailwind + custom CSS
- Responsive layout

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### Cloud
- AWS S3 (file storage)

---

## 📁 Project Structure

```
backend/
  controllers/
  routes/
  models/
  middleware/
  config/

frontend/
  src/
    components/
    pages/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd CodeVault
```

---

### 2️⃣ Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside backend:

```
PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
```

Run backend:
```bash
npm start
```

---

### 3️⃣ Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🚧 Future Improvements

- ⭐ Star repositories  
- 💬 Comments / Issues system  
- 🧾 Commit history UI  
- 🔔 Notifications  
- 🧑‍🤝‍🧑 Collaboration (multi-user repositories)

---

## 📸 Screenshots

_Add screenshots here_

---

## 🙌 Author

- Aayush Raj

---

## 📌 Note

This project is built for learning purposes to understand how GitHub-like systems work internally.
