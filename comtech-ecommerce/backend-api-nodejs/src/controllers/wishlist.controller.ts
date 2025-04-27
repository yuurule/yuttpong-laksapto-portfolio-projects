import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { WishlistService } from '../services/wishlist.service';
import { parseBoolean } from '../libs/utility';

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

  async getWishlistsByCustomer(req: Request, res: Response) {

      const customerId = parseInt(req.params.id);

      if(!isValidId(customerId)) {
        sendError(res, 400, `Customer id must not zero or negative number`);
      }

      const page = parseInt(req.query.page as string || '1');
      const pageSize = parseInt(req.query.pageSize as string || '8');
      const pagination = parseBoolean(req.query.noPagination as string) || true;
      const orderBy = req.query.orderBy as string || 'assignedAt';
      const orderDir = req.query.orderDir as string || 'desc';
  
      try {
        const wishlists = await wishlistService.findAllByCustomer(customerId, page, pageSize, pagination, orderBy, orderDir);
        sendResponse(res, 200, `Get all wishlists by customer ok`, wishlists.data, wishlists.meta)
      }
      catch (error: any) {
        console.error('Get all wishlists by customer error: ', error);
        sendError(res, error.statusCode, error.message);
      }
    }

}