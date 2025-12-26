const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a subscription name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Streaming',
            'Music',
            'Software',
            'Cloud Services',
            'Gaming',
            'Fitness',
            'Education',
            'Productivity',
            'News',
            'Shopping',
            'Food',
            'Health',
            'Other'
        ]
    },
    cost: {
        type: Number,
        required: [true, 'Please add the subscription cost']
    },
    billingCycle: {
        type: String,
        required: [true, 'Please select a billing cycle'],
        enum: ['Monthly', 'Quarterly', 'Yearly', 'Custom']
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    renewalDate: {
        type: Date,
        required: [true, 'Please add a renewal date']
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Paused'],
        default: 'Active'
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
