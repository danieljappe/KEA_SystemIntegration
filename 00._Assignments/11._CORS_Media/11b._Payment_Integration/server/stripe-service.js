import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product and price mapping (In a real app, this would come from a database)
const PRODUCTS = {
    'test-product': {
        name: 'Test Product',
        amount: 1999,  // $19.99 in cents
        currency: 'usd',
    },
    'test-product-2': {
        name: 'Test Product 2',
        amount: 9999,
        currency: 'dkk'
    }
};

export async function createCheckoutSession(priceId, successUrl, cancelUrl) {
    const product = PRODUCTS[priceId];
    
    if (!product) {
        throw new Error(`Product with ID ${priceId} not found`);
    }

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
    });

    return session;
}

export async function retrievePaymentIntent(paymentIntentId) {
    return stripe.paymentIntents.retrieve(paymentIntentId);
}