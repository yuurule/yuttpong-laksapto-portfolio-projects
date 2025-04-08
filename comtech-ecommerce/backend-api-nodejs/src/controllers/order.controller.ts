import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { OrderService } from '../services/order.service';
import { createOrderDto } from '../types';

const orderService = new OrderService();

export class OrderController {

  async getOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.findAll();
      sendResponse(res, 200, `Get all order ok`, orders)
    }
    catch (error: any) {
      console.error('Get all order error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOrderById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Order id must not zero or negative number`);
    }

    try {
      const order = await orderService.findOne(id);
      sendResponse(res, 200, `Get order by id ok`, order);
    }
    catch (error: any) {
      console.error('Get order by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createOrder(req: Request, res: Response) {
    const { 
      customerId,
      shippingAddress,
      note,
      total, 
      items 
    } = req.body;

    if(!isValidHaveValue([customerId, total, items])) {
      sendError(res, 400, `customerId, total and items is required`);
    }

    if(!isValidId(customerId)) {
      sendError(res, 400, `Customer id must not zero or negative number`);
    }

    for(let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];
      if(!isValidHaveValue([productId, quantity])) {
        sendError(res, 400, `Cart item require productId and quantity`);
      }

      if(!isValidId(productId)) {
        sendError(res, 400, `Product id must not zero or negative number`);
      }

      if(!isValidId(quantity)) {
        sendError(res, 400, `Quantity must not zero or negative number`);
      }
    }

    const data : createOrderDto = {
      customerId: customerId,
      note: note,
      total: total,
      items: items
    }

    if(shippingAddress) {
      data.shippingAddress = {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        region: shippingAddress.region,
        street: shippingAddress.street,
        postcode: shippingAddress.postcode,
        city: shippingAddress.city,
      }
    }

    try {
      const newOrder = await orderService.create(data);
      sendResponse(res, 201, `Creating order ok`, newOrder);
    }
    catch (error: any) {
      console.error('Creating order error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updatePayment(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { paymentStatus } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Order id must not zero or negative number`);
    }

    if(!isValidHaveValue([paymentStatus])) {
      sendError(res, 400, `paymentStstus is required`);
    }

    try {
      const updatePayment = await orderService.updatePayment(id, paymentStatus);
      sendResponse(res, 200, `Updating order payment ok`, updatePayment)
    }
    catch (error: any) {
      console.error('Updating order payment error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateDelivery(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { deliveryStatus } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Order id must not zero or negative number`);
    }

    if(!isValidHaveValue([deliveryStatus])) {
      sendError(res, 400, `deliveryStatus is required`);
    }

    try {
      const updateDelivery = await orderService.updateDelivery(id, deliveryStatus);
      sendResponse(res, 200, `Updating order delivery ok`, updateDelivery)
    }
    catch (error: any) {
      console.error('Updating order delivery error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}