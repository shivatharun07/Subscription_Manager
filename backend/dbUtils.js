require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Clear all users (use with caution)
const clearUsers = async () => {
  try {
    await connectDB();
    const User = require('./models/User');
    await User.deleteMany({});
    console.log('All users cleared from database');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing users:', error);
    process.exit(1);
  }
};

// Clear all subscriptions (use with caution)
const clearSubscriptions = async () => {
  try {
    await connectDB();
    const Subscription = require('./models/Subscription');
    await Subscription.deleteMany({});
    console.log('All subscriptions cleared from database');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing subscriptions:', error);
    process.exit(1);
  }
};

// Clear entire database (use with caution)
const clearDatabase = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared completely');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Get command line argument
const command = process.argv[2];

switch (command) {
  case 'clear-users':
    clearUsers();
    break;
  case 'clear-subscriptions':
    clearSubscriptions();
    break;
  case 'clear-all':
    clearDatabase();
    break;
  default:
    console.log('Available commands:');
    console.log('  clear-users        - Clear all users');
    console.log('  clear-subscriptions - Clear all subscriptions');
    console.log('  clear-all          - Clear entire database');
    console.log('');
    console.log('Usage: node dbUtils.js <command>');
    process.exit(0);
}