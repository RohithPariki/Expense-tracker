# 💰 Personal Expense Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application to track personal income and expenses, filter by category/date, and visualize spending using charts.

## 🚀 Features

- ✅ JWT Authentication (Login / Register)
- 💵 Add / Delete income & expense transactions
- 📅 Filter transactions by category and date
- 📊 Pie chart to visualize expense categories
- 🔒 Protected routes and user-specific data
- 🎯 Clean and responsive UI with TailwindCSS

---

## 🛠️ Tech Stack

**Frontend**
- React
- Axios
- React Router
- Chart.js (via `react-chartjs-2`)
- TailwindCSS

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcrypt.js (Password hashing)
- dotenv (Environment variables)

---

## 🧪 Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker

cd backend
npm install
# Create a .env file
touch .env

# .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
npm start

#frontend setup
cd frontend
npm install
npm run dev
