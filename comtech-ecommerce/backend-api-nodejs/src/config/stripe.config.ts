import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.STRIPE_SECRET_KEY) {
  throw new Error(`Missing Stripe secret key`);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil', // ใช้ api เวอร์ชั่นล่าสุด
});

export default stripe;