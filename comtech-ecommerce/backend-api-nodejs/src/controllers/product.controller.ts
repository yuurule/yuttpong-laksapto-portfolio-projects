import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
//import { YourService } from '../services/yourServiceName.service';

//const yourService = new YourService();

export class ProductController {

  async getProducts(req: Request, res: Response) {
    try {

      sendResponse(res, 200, `____ ok`, null)
    }
    catch (error: any) {
      console.error('____ error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id);

    if(isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    try {

      sendResponse(res, 200, `____ ok`, null)
    }
    catch (error: any) {
      console.error('____ error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createNewProduct(req: Request, res: Response) {

    try {

      sendResponse(res, 200, `____ ok`, null)
    }
    catch (error: any) {
      console.error('____ error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id);

    if(isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    try {

      sendResponse(res, 200, `____ ok`, null)
    }
    catch (error: any) {
      console.error('____ error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async moveProductToTrash(req: Request, res: Response) {
    // const productId = parseInt(req.params.id);

    // if(isValidId(productId)) {
    //   sendError(res, 400, `Product id must not zero or negative number`);
    // }

    try {

      sendResponse(res, 200, `____ ok`, null)
    }
    catch (error: any) {
      console.error('____ error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}
