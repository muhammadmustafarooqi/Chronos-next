import Drop from '../models/Drop.js';
import Waitlist from '../models/Waitlist.js';
import { sendEmail } from '../utils/emailService.js';
import { notifyUserByEmail } from '../utils/pushService.js';

export function startDropReleaser() {
    setInterval(async () => {
        try {
            const now = new Date();

            // 1. Activate Gold+ early access window
            const goldAccessDrops = await Drop.find({
                status: 'scheduled'
            });
            
            for (const drop of goldAccessDrops) {
                const earlyAccessTime = new Date(drop.releaseDate.getTime() - (drop.goldPlusEarlyAccessHours * 60 * 60 * 1000));
                
                if (now >= earlyAccessTime) {
                    drop.status = 'gold-access';
                    await drop.save();
                    
                    // Email all Gold/Platinum waitlist members
                    const waitlist = await Waitlist.find({
                        drop: drop._id,
                        vipTier: { $in: ['gold','platinum'] },
                        notified: false
                    });
                    
                    for (const entry of waitlist) {
                        try {
                            await sendEmail({
                                to: entry.email,
                                subject: `Early Access: ${drop.dropName} is now available`,
                                template: 'dropEarlyAccess.html',
                                variables: {
                                    dropName: drop.dropName,
                                    productUrl: `${process.env.FRONTEND_URL}/product/${drop.product}`,
                                    hoursRemaining: drop.goldPlusEarlyAccessHours
                                }
                            });
                            notifyUserByEmail(entry.email, {
                                title: 'Exclusive Early Access',
                                body: `${drop.dropName} is now available to shop.`,
                                url: `/drops`
                            }).catch(e => console.error(e));
                            
                            entry.notified = true;
                            await entry.save();
                        } catch (err) {
                            console.error('Failed to notify waitlist entry:', err);
                        }
                    }
                }
            }

            // 2. Go fully live
            const liveDrops = await Drop.find({
                status: 'gold-access',
                releaseDate: { $lte: now }
            });
            
            for (const drop of liveDrops) {
                drop.status = 'live';
                await drop.save();
                
                // Email remaining waitlist members (Bronze/Silver)
                const waitlist = await Waitlist.find({
                    drop: drop._id,
                    notified: false
                });
                
                for (const entry of waitlist) {
                    try {
                        await sendEmail({
                            to: entry.email,
                            subject: `${drop.dropName} is now live!`,
                            template: 'dropEarlyAccess.html', // Reusing template for simplicity, we could adapt it
                            variables: {
                                dropName: drop.dropName,
                                productUrl: `${process.env.FRONTEND_URL}/product/${drop.product}`,
                                hoursRemaining: 0
                            }
                        });
                        notifyUserByEmail(entry.email, {
                            title: 'Drop is Live!',
                            body: `${drop.dropName} is now available to everyone.`,
                            url: `/drops`
                        }).catch(e => console.error(e));
                        
                        entry.notified = true;
                        await entry.save();
                    } catch (err) {
                        console.error('Failed to notify waitlist entry:', err);
                    }
                }
            }
        } catch (error) {
            console.error('[DropReleaser] Error running job:', error);
        }
    }, 5 * 60 * 1000); // every 5 minutes
}
