# 🩸 BloodBank Pro — MERN Stack Blood Donor Management System

A production-ready full-stack blood donor management system built with MongoDB, Express.js, React.js, and Node.js.

---

## 📁 Project Structure

```
blood-donor/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seed test users
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── donorController.js
│   │   └── requestController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + authorize
│   │   └── error.js           # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── donors.js
│   │   └── requests.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── Dashboard.js
    │   │   ├── DonorsPage.js
    │   │   ├── DonorProfile.js
    │   │   ├── RequestsPage.js
    │   │   └── UsersPage.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Edit .env — set your MONGO_URI if using Atlas
# Default: mongodb://localhost:27017/blooddonor

npm run seed        # Insert 3 test users
npm run dev         # Start backend on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start           # Start React on port 3000
```

---

## 🔐 Test User Credentials

| Role     | Email                      | Password     |
|----------|----------------------------|--------------|
| Admin    | admin@bloodbank.com        | Password@123 |
| Donor    | donor@bloodbank.com        | Password@123 |
| Receiver | receiver@bloodbank.com     | Password@123 |

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| POST   | /api/auth/register    | Public  |
| POST   | /api/auth/login       | Public  |
| GET    | /api/auth/me          | Private |

### Users
| Method | Endpoint         | Access      |
|--------|------------------|-------------|
| GET    | /api/users       | Admin only  |
| GET    | /api/users/:id   | Private     |
| PUT    | /api/users/:id   | Self/Admin  |
| DELETE | /api/users/:id   | Admin only  |

### Donors
| Method | Endpoint          | Access        |
|--------|-------------------|---------------|
| POST   | /api/donors       | Donor/Admin   |
| GET    | /api/donors       | All logged in |
| GET    | /api/donors/:id   | All logged in |
| PUT    | /api/donors/:id   | Donor/Admin   |
| DELETE | /api/donors/:id   | Donor/Admin   |

**Query params for GET /api/donors:** `bloodGroup`, `location`, `availability`

### Requests
| Method | Endpoint                    | Access           |
|--------|-----------------------------|------------------|
| POST   | /api/requests               | Receiver/Admin   |
| GET    | /api/requests               | All logged in    |
| PUT    | /api/requests/:id/status    | Admin/Donor      |
| DELETE | /api/requests/:id           | Requester/Admin  |

---

## 🎭 Role-Based Access Control

| Feature              | Admin | Donor | Receiver |
|----------------------|-------|-------|----------|
| View Dashboard       | ✅    | ✅    | ✅       |
| View Donors          | ✅    | ✅    | ✅       |
| Manage Own Profile   | —     | ✅    | —        |
| Create Blood Request | —     | —     | ✅       |
| Approve/Reject Req   | ✅    | ✅    | —        |
| Manage All Users     | ✅    | —     | —        |
| Delete Any Resource  | ✅    | —     | —        |

---

## ⚙️ Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blooddonor
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🛡️ Security Features
- Passwords hashed with **bcryptjs** (10 salt rounds)
- **JWT** authentication with expiry
- Role-based middleware on every protected route
- Global error handler with Mongoose error normalization
- CORS configured for frontend origin only

---

## 🏗️ Production Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in dashboard
2. Set `MONGO_URI` to MongoDB Atlas connection string
3. Set `NODE_ENV=production`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build`
3. Deploy the `build/` folder
