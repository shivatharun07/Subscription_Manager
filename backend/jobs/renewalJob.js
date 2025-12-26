const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

const initRenewalJob = () => {
    // Schedule job to run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('--- Running Renewal Check Job ---');

        try {
            // Calculate date for 2 days from now
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
            twoDaysFromNow.setHours(0, 0, 0, 0);

            const nextDay = new Date(twoDaysFromNow);
            nextDay.setDate(nextDay.getDate() + 1);

            // Find all active subscriptions renewing in exactly 2 days
            const subscriptions = await Subscription.find({
                status: 'Active',
                renewalDate: {
                    $gte: twoDaysFromNow,
                    $lt: nextDay
                }
            }).populate('user');

            console.log(`Found ${subscriptions.length} subscriptions renewing in 2 days.`);

            for (const sub of subscriptions) {
                const user = sub.user;
                if (user && user.email) {
                    try {
                        await sendEmail({
                            email: user.email,
                            subject: `Renewal Alert: Your ${sub.name} subscription renews in 2 days`,
                            message: `Hi ${user.name},\n\nThis is a reminder that your ${sub.name} subscription (${sub.category}) will renew on ${new Date(sub.renewalDate).toLocaleDateString()} for ₹${sub.cost}.\n\nManage your subscriptions here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
                            html: `
                                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                                    <h2 style="color: #f43f5e;">Renewal Alert!</h2>
                                    <p>Hi <strong>${user.name}</strong>,</p>
                                    <p>Your <strong>${sub.name}</strong> subscription is set to renew in 2 days.</p>
                                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p style="margin: 5px 0;"><strong>Service:</strong> ${sub.name}</p>
                                        <p style="margin: 5px 0;"><strong>Cost:</strong> ₹${sub.cost}</p>
                                        <p style="margin: 5px 0;"><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</p>
                                    </div>
                                    <p>You can manage this subscription on your dashboard.</p>
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
                                </div>
                            `
                        });
                        console.log(`Reminder email sent to ${user.email} for ${sub.name}`);
                    } catch (emailErr) {
                        console.error(`Error sending email to ${user.email}:`, emailErr.message);
                    }
                }
            }
        } catch (err) {
            console.error('Error in Renewal Check Job:', err.message);
        }
    });

    console.log('Renewal Alert Job initialized.');
};

module.exports = initRenewalJob;
