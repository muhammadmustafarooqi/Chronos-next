import cron from 'node-cron';
import Order from '../models/Order.js';

/**
 * Order Simulator Job (Feature 7)
 * Automatically advances 'Pending' and 'Processing' orders through timeline stages
 * for demonstration and QA purposes.
 */
const STAGES = [
    'Order Confirmed',
    'Being Prepared',
    'Quality Checked',
    'Dispatched',
    'Out for Delivery',
    'Delivered'
];

const simulateOrders = async () => {
    try {
        console.log('🕒 Running Order Simulator Job...');
        
        // Find orders that are not Delivered or Cancelled
        const activeOrders = await Order.find({ 
            status: { $nin: ['Delivered', 'Cancelled'] } 
        });

        for (const order of activeOrders) {
            const currentStage = order.deliveryTimeline[order.deliveryTimeline.length - 1]?.stage || 'Order Confirmed';
            const currentIndex = STAGES.indexOf(currentStage);

            if (currentIndex < STAGES.length - 1) {
                const nextStage = STAGES[currentIndex + 1];
                
                order.deliveryTimeline.push({
                    stage: nextStage,
                    timestamp: new Date(),
                    note: `Simulated update: Your order is now in ${nextStage} stage.`
                });

                // Sync status with timeline
                if (nextStage === 'Dispatched') order.status = 'Shipped';
                if (nextStage === 'Delivered') {
                    order.status = 'Delivered';
                    if (order.paymentMethod === 'cod') order.paymentStatus = 'paid';
                }
                if (['Being Prepared', 'Quality Checked'].includes(nextStage)) order.status = 'Processing';

                await order.save();
                console.log(`✅ Order ${order.orderId} advanced to ${nextStage}`);
            }
        }
    } catch (error) {
        console.error('❌ Order Simulator Error:', error);
    }
};

// Run every 5 minutes in development for visible progress
// In production this would be much slower or triggered by real events
const scheduleSimulator = () => {
    cron.schedule('*/5 * * * *', simulateOrders);
    console.log('📅 Order Simulator Scheduled (Every 5 minutes)');
};

export default scheduleSimulator;
