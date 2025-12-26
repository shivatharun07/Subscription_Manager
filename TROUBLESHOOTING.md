# Troubleshooting Guide

## Common Issues and Solutions

### 1. Duplicate Email Error (E11000)

**Error Message:** `MongoServerError: E11000 duplicate key error collection: subscription_manager.users index: email_1 dup key: { email: "your-email@gmail.com" }`

**Solution Options:**

#### Option A: Use a Different Email
Simply register with a different email address that hasn't been used before.

#### Option B: Clear Existing Users (Development Only)
If you're in development and want to start fresh:

```bash
cd backend
npm run db:clear-users
```

#### Option C: Clear Entire Database (Development Only)
To completely reset the database:

```bash
cd backend
npm run db:clear-all
```

**Warning:** Options B and C will permanently delete data. Only use in development!

### 2. MongoDB Connection Issues

**Error:** `MongoDB Connection Error`

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Check your `.env` file in the backend directory has the correct MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/subscription_manager
   ```

### 3. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. Or change the port in your `.env` file:
   ```
   PORT=5001
   ```

### 4. CORS Issues

**Error:** `Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** The backend is already configured for CORS. If you still see this error, make sure both servers are running and the API URLs in the frontend match the backend routes.

### 5. JWT Token Issues

**Error:** `Invalid token` or authentication failures

**Solutions:**
1. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```

2. Make sure the JWT_SECRET in your `.env` file is set:
   ```
   JWT_SECRET=subscription_manager_secret_key_12345
   ```

## Quick Reset (Development)

To completely reset your development environment:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear database
cd backend
npm run db:clear-all

# 3. Clear browser storage
# Open browser dev tools > Application > Storage > Clear storage

# 4. Restart servers
cd ..
npm run dev
```

## Getting Help

If you encounter other issues:
1. Check the browser console for frontend errors
2. Check the terminal/command prompt for backend errors
3. Ensure all dependencies are installed (`npm install` in both backend and frontend directories)
4. Make sure you're using the correct Node.js version (v14 or higher)