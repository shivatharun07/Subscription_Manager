const Subscription = require('../models/Subscription');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all subscriptions for a user
// @route   GET /api/subscriptions
// @access  Private
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
    const subscriptions = await Subscription.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        count: subscriptions.length,
        data: subscriptions
    });
});

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
exports.getSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return next(
            new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns the subscription
    if (subscription.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User not authorized to access this subscription`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: subscription
    });
});

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = asyncHandler(async (req, res, next) => {
    console.log('=== Create Subscription Request ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Authenticated User ID:', req.user.id);

    try {
        // Add user to req.body
        req.body.user = req.user.id;

        // Define valid categories and mappings
        const validCategories = [
            'Streaming', 'Music', 'Software', 'Gaming', 'Fitness', 'Cloud Storage', 'Other',
            'Productivity', 'News', 'Education', 'Shopping', 'Food', 'Health', 'Utilities', 'Entertainment', 'Cloud Services'
        ];

        // Transform and validate category
        if (req.body.category) {
            // Trim and title case the category
            const formattedCategory = req.body.category.trim()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            // Check if the formatted category is valid
            const matchedCategory = validCategories.find(
                cat => cat.toLowerCase() === formattedCategory.toLowerCase()
            );

            if (!matchedCategory) {
                return next(new ErrorResponse(
                    `Invalid category. Valid categories are: ${validCategories.join(', ')}`,
                    400
                ));
            }

            // Use the exact case from valid categories
            req.body.category = matchedCategory;
        }

        console.log('Processed subscription data:', JSON.stringify(req.body, null, 2));

        // Validate required fields based on Schema
        const requiredFields = ['name', 'category', 'billingCycle', 'cost', 'renewalDate'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return next(new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400));
        }

        // Default startDate to now if not provided
        if (!req.body.startDate) {
            req.body.startDate = Date.now();
        }

        console.log('Creating subscription in database...');
        const subscription = await Subscription.create(req.body);
        console.log('Subscription created successfully:', subscription);

        res.status(201).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        next(error);
    }
});

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
exports.updateSubscription = asyncHandler(async (req, res, next) => {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return next(
            new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns the subscription
    if (subscription.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User not authorized to update this subscription`, 401)
        );
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: subscription
    });
});

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return next(
            new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns the subscription
    if (subscription.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User not authorized to delete this subscription`, 401)
        );
    }

    await subscription.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
