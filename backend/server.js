require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const errorHandler = require('./middleware/error');
const initRenewalJob = require('./jobs/renewalJob');

const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

// Handle preflight requests
app.options('*', cors(corsOptions));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB().then(() => {
  // Initialize cron jobs after DB connection
  initRenewalJob();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Subscription Manager API',
    endpoints: {
      auth: '/api/v1/auth',
      subscriptions: '/api/v1/subscriptions'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});