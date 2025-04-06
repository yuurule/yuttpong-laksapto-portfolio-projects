import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { CartService } from '../services/cart.service';
import { createCartItemDto } from '../types';

const cartService = new CartService();

export class CartController {

  async getCartItems(req: Request, res: Response) {
    try {
      const cartItems = await cartService.findAll();
      sendResponse(res, 200, `Get all cart item ok`, cartItems)
    }
    catch (error: any) {
      console.error('Get all cart item error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getCartByCustomer(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Cart item id must not zero or negative number`);
    }

    try {
      const cart = await cartService.findAllByCustomerId(id);
      sendResponse(res, 200, `Get cart by customer id ok`, cart);
    }
    catch (error: any) {
      console.error('Get cart by customer id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async addCartItem(req: Request, res: Response) {
    const { customerId, productId, quantity } = req.body;

    if(!isValidHaveValue([customerId, productId, quantity])) {
      sendError(res, 400, `customerId, productId and quantity is required`);
    }

    if(!isValidId(customerId)) {
      sendError(res, 400, `Customer id must not zero or negative number`);
    }

    if(!isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    const data : createCartItemDto = {
      customerId: customerId,
      productId: productId,
      quantity: quantity,
    }

    try {
      const newCartItem = await cartService.create(data);
      sendResponse(res, 201, `Creating cart item ok`, newCartItem);
    }
    catch (error: any) {
      console.error('Creating tag error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateCartItem(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { 
      quantity, 
      actionType='update' 
    } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Cart item id must not zero or negative number`);
    }

    if(!isValidHaveValue([quantity])) {
      sendError(res, 400, `quantity is required`);
    }

    try {
      const updateCartItem = await cartService.update(id, quantity, actionType);
      sendResponse(res, 200, `Updating cart item ok`, updateCartItem)
    }
    catch (error: any) {
      console.error('Updating cart item error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async deleteCartItems(req: Request, res: Response) {
    const { cartItemsId } = req.body;

    for(let i = 0; i < cartItemsId.length; i++) {
      if(!isValidId(cartItemsId[i])) {
        sendError(res, 400, `Cart item id must not zero or negative number`);
      }
    }

    try {
      const deleteCartItems = await cartService.delete(cartItemsId);
      sendResponse(res, 200, `Deleting cart items ok`, deleteCartItems)
    }
    catch (error: any) {
      console.error('Deleting cart items error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}