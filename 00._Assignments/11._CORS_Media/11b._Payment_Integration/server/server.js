import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createCheckoutSession } from './stripe-service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId } = req.body;
        
        const successUrl = 'http://localhost:3000/success.html';
        const cancelUrl = 'http://localhost:3000/cancel.html';
        
        const session = await createCheckoutSession(
            priceId,
            successUrl,
            cancelUrl
        );
        
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});