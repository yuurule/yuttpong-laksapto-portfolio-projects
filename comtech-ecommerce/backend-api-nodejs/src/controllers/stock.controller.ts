import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { StockService } from '../services/stock.service';
import { createStockActionDto } from '../types';

const stockService = new StockService();

export class StockController {

  async getAllStockAction(req: Request, res: Response) {
    try {
      const stockActions = await stockService.findAll();
      sendResponse(res, 200, `Get all stock action ok`, stockActions)
    }
    catch (error: any) {
      console.error('Get all stock action error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneStockActionById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Stock action id must not zero or negative number`);
    }

    try {
      const stockAction = await stockService.findOne(id);
      sendResponse(res, 200, `Get stock action by id ok`, stockAction);
    }
    catch (error: any) {
      console.error('Get stock action by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createNewStockAction(req: Request, res: Response) {
    const { productId, userId, actionType, quantity, reason } = req.body;

    if(!isValidHaveValue([productId, userId, actionType, quantity])) {
      sendError(res, 400, `productId, userId, actionType and quantity is required`);
    }

    if(!isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const dataDto : createStockActionDto = {
      productId: productId,
      userId: userId,
      actionType: actionType,
      quantity: quantity
    }

    if(isValidHaveValue([reason])) {
      dataDto.reason = reason;
    }

    try {
      const newStockAction = await stockService.create(dataDto);
      sendResponse(res, 201, `Creating stock action ok`, newStockAction);
    }
    catch (error: any) {
      console.error('Creating stock action error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}