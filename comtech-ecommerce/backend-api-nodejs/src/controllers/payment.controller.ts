import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import stripe from '../config/stripe.config';
import { CreatePaymentResponse, PaymentVerificationResponse } from '../types';
import { AppError } from '../utils/errorHandler';
import { sendResponse, sendError } from '../libs/response';
import { OrderService } from '../services/order.service';

const prisma = new PrismaClient()
const orderService = new OrderService()

export class PaymentController {

  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { 
        amount, 
        currency = 'thb', 
        orderId,
        paymentMethodType = 'card',
      } = req.body;

      // ตรวจสอบข้อมูลที่ส่งมา
      if (!amount || amount < 1) {
        throw new AppError(`Invalid amount`, 400);
      }

      // สร้าง Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe ใช้หน่วยเป็น satang (สตางค์)
        currency: currency,
        payment_method_types: [paymentMethodType],
        description: 'Payment for products/services',
      });

      // Get payment intent id and update order payment intent id here 
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentIntent: paymentIntent.id
        }
      })

      const response: CreatePaymentResponse = {
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret,
        }
      };

      res.status(200).json(response);
    } catch (error: any) {
      throw new AppError(`${error.message || 'Error creating payment intent'}`, 500);
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        throw new AppError(`Payment ID is required`, 400);
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      
      const response: PaymentVerificationResponse = {
        success: true,
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          created: paymentIntent.created,
        }
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error verifying payment' 
      });
    }
  }

  async stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new AppError(`Webhook secret is not configured`, 400);
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );

      // จัดการกับ events ต่างๆ
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment succeeded: ${paymentIntent.id}`);
          // อัพเดทสถานะการชำระเงินในฐานข้อมูลของคุณ
          // const orderId = await prisma.order.findFirst({
          //   where: { paymentIntent: paymentIntent.id }
          // })
          // if(orderId) {
          //   await orderService.updatePayment(orderId.id, 'PAID')
          // }
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment failed: ${failedPaymentIntent.id}`);
          // จัดการกับการชำระเงินที่ล้มเหลว
          // await prisma.order.updateMany({
          //   where: { paymentIntent: failedPaymentIntent.id },
          //   data: {
          //     paymentStatus: 'FAILED'
          //   }
          // })
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });

    } catch (error: any) {
      throw new AppError(`Webhook Error: ${error.message}`, 400);
    }
  }
}