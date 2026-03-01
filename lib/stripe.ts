import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

export const STRIPE_PRICES = {
    // One-time payments
    REVISION: 'price_revision_placeholder',     // e.g. $9 per additional revision
    SOURCE_CODE: 'price_source_code_placeholder', // e.g. $29 to download code
    DOMAIN: 'price_domain_placeholder',          // Dynamic — set at checkout time

    // Subscriptions
    HOSTING_MONTHLY: 'price_hosting_monthly_placeholder', // e.g. $12/month to keep site live
    BUSINESS_PLAN: 'price_business_placeholder',           // $19/month Business plan
    PRO_PLAN: 'price_pro_placeholder',                     // $49/month Pro plan
}
