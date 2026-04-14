/**
 * VIP Tier Utility Functions (Feature 6)
 * Calculates tier from total spend and defines perks per tier.
 */

export const TIER_THRESHOLDS = {
    bronze:   0,
    silver:   1000,
    gold:     5000,
    platinum: 20000,
};

export const TIER_PERKS = {
    bronze: {
        label: 'Bronze',
        color: '#CD7F32',
        shipping: 'Standard shipping',
        perks: ['Access to full catalogue', 'Order tracking', 'Wishlist'],
    },
    silver: {
        label: 'Silver',
        color: '#C0C0C0',
        shipping: 'Free standard shipping on all orders',
        perks: ['Free standard shipping', 'Priority support', 'Exclusive lookbooks'],
    },
    gold: {
        label: 'Gold',
        color: '#D4AF37',
        shipping: 'Free express shipping',
        perks: ['Free express shipping', 'Early access to new arrivals (48h)', 'Private sale invitations'],
    },
    platinum: {
        label: 'Platinum',
        color: '#9B59B6',
        shipping: 'White-glove complimentary delivery',
        perks: ['All Gold perks', 'Personal concierge callback', 'Exclusive Platinum-only listings', 'Annual Horology Masterclass'],
    },
};

/**
 * Calculate VIP tier from total spend amount.
 * @param {number} totalSpend
 * @returns {'bronze'|'silver'|'gold'|'platinum'}
 */
export const calculateTier = (totalSpend) => {
    if (totalSpend >= TIER_THRESHOLDS.platinum) return 'platinum';
    if (totalSpend >= TIER_THRESHOLDS.gold)     return 'gold';
    if (totalSpend >= TIER_THRESHOLDS.silver)   return 'silver';
    return 'bronze';
};

/**
 * Get the next tier threshold given the current spend.
 * Returns null if already at the top tier.
 * @param {number} totalSpend
 * @returns {number|null}
 */
export const nextTierThreshold = (totalSpend) => {
    if (totalSpend < TIER_THRESHOLDS.silver)   return TIER_THRESHOLDS.silver;
    if (totalSpend < TIER_THRESHOLDS.gold)     return TIER_THRESHOLDS.gold;
    if (totalSpend < TIER_THRESHOLDS.platinum) return TIER_THRESHOLDS.platinum;
    return null;
};
