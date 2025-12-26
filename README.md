# Subscription Manager

A full-stack web application to manage your subscriptions built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication (register/login)
- Add, view, and delete subscriptions
- Track renewal dates and costs
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (optional - for running both servers)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory with:

```
MONGODB_URI=mongodb://localhost:27017/subscription_manager
JWT_SECRET=subscription_manager_secret_key_12345
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=development
PORT=5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Application

#### Option 1: Run both servers simultaneously (from root directory)
```bash
npm run dev
```

#### Option 2: Run servers separately

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/me` - Get current user

### Subscriptions
- GET `/api/v1/subscriptions` - Get all user subscriptions
- POST `/api/v1/subscriptions` - Create new subscription
- PUT `/api/v1/subscriptions/:id` - Update subscription
- DELETE `/api/v1/subscriptions/:id` - Delete subscription

## Project Structure

```
subscription-manager/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── package.json
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- React Router DOM
- Axios for API calls
- CSS3 for styling

## Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in `.env` file or kill the process using the port
3. **CORS Issues**: The backend is configured to allow all origins in development
4. **API Errors**: Check the browser console and backend logs for detailed error messages