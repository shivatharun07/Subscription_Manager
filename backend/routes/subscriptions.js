const express = require('express');
const { 
    getSubscriptions, 
    getSubscription, 
    createSubscription, 
    updateSubscription, 
    deleteSubscription 
} = require('../controllers/subscriptions');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/')
    .get(getSubscriptions)
    .post(createSubscription);

router
    .route('/:id')
    .get(getSubscription)
    .put(updateSubscription)
    .delete(deleteSubscription);

module.exports = router;
