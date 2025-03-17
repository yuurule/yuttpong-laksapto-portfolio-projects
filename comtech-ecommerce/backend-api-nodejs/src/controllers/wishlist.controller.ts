import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { WishlistService } from '../services/wishlist.service';

const wishlistService = new WishlistService();

export class WishlistController {

  async addWishlist(req: Request, res: Response) {
    const { customerId, productId } = req.body;

    if(!isValidId(customerId)) {
      sendError(res, 400, `Customer id must not zero or negative number`);
    }

    if(!isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    try {
      const addWishlist = await wishlistService.add(customerId, productId);
      sendResponse(res, 201, `Add wishlist ok`, addWishlist)
    }
    catch (error: any) {
      console.error('Add wishlist error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async removeWishlist(req: Request, res: Response) {
    const wishlistId = parseInt(req.params.id);

    try {
      const removeWishlist = await wishlistService.remove(wishlistId);
      sendResponse(res, 200, `Remove wishlist ok`, removeWishlist)
    }
    catch (error: any) {
      console.error('Remove wishlist error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}