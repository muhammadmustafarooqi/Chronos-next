import jwt from 'jsonwebtoken';
import Auction from '../models/Auction.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import { notifyUserByEmail } from '../utils/pushService.js';

export function initAuctionSocket(io) {
    io.on('connection', (socket) => {
        
        socket.on('join-auction', (auctionId) => {
            socket.join(`auction:${auctionId}`);
        });

        socket.on('place-bid', async ({ auctionId, amount, userId, customerName, token }) => {
            try {
                // 1. Verify JWT token
                if (!token) return;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.id !== userId) return;

                // 2. Fetch user and customer data, check active auction
                const auction = await Auction.findById(auctionId);
                if (!auction || auction.status !== 'live' || new Date(auction.endTime) < new Date()) {
                    socket.emit('bid-error', { message: 'Auction is not live or has ended.' });
                    return;
                }

                // 3. Minimum bid increment $50
                if (amount < auction.currentPrice + 50) {
                    socket.emit('bid-error', { message: 'Bid amount must be at least $50 higher than current price.' });
                    return;
                }

                // 4. Verify VIP Tier
                const customer = await Customer.findOne({ user: userId });
                const tierMap = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
                const userTierVal = tierMap[customer?.vipTier || 'bronze'];
                const minTierVal = tierMap[auction.minimumVipTier];
                if (userTierVal < minTierVal) {
                    socket.emit('bid-error', { message: `This auction requires at least ${auction.minimumVipTier} VIP tier.` });
                    return;
                }

                // 5. Place bid atomically
                const timestamp = new Date();
                const timeRemainingMs = new Date(auction.endTime).getTime() - timestamp.getTime();
                let newEndTime = auction.endTime;
                let timeExtended = false;

                if (timeRemainingMs < 2 * 60 * 1000) {
                    newEndTime = new Date(timestamp.getTime() + 2 * 60 * 1000);
                    timeExtended = true;
                }

                const updatedAuction = await Auction.findOneAndUpdate(
                    { 
                        _id: auctionId, 
                        status: 'live',
                        endTime: { $gt: timestamp },
                        $or: [
                            { currentPrice: { $lt: amount - 49.99 } }, // Ensure min $50 increment
                            { bids: { $size: 0 } }
                        ]
                    },
                    {
                        $push: {
                            bids: {
                                $each: [{
                                    user: userId,
                                    customerName,
                                    amount,
                                    timestamp
                                }],
                                $position: 0
                            }
                        },
                        $set: {
                            currentPrice: amount,
                            endTime: newEndTime
                        }
                    },
                    { new: true }
                );

                if (!updatedAuction) {
                    socket.emit('bid-error', { message: 'Bid failed. Price may have changed or auction ended.' });
                    return;
                }

                const previousHighestBidder = updatedAuction.bids.length > 1 ? updatedAuction.bids[1] : null;

                // Notify previous highest bidder
                if (previousHighestBidder && previousHighestBidder.user.toString() !== userId) {
                    const prevUser = await User.findById(previousHighestBidder.user);
                    if (prevUser && prevUser.email) {
                        notifyUserByEmail(prevUser.email, {
                            title: 'You\'ve been outbid!',
                            body: `Someone just placed a higher bid ($${amount}) on the auction.`,
                            url: `/auctions/${auctionId}`
                        }).catch(console.error);
                    }
                }

                // 7. Emit events
                io.to(`auction:${auctionId}`).emit('bid-placed', {
                    amount,
                    customerName,
                    timestamp,
                    newCurrentPrice: amount
                });

                if (timeExtended) {
                    io.to(`auction:${auctionId}`).emit('time-extended', {
                        newEndTime: auction.endTime
                    });
                }
            } catch (error) {
                console.error('[Socket] Bid error:', error.message);
                socket.emit('bid-error', { message: 'Invalid token or server error.' });
            }
        });

        socket.on('leave-auction', (auctionId) => {
            socket.leave(`auction:${auctionId}`);
        });
    });
}
