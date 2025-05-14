import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { StockService } from '../services/stock.service';
import { createStockActionDto, createStockSellActionDto } from '../types';
import { parseBoolean } from '../libs/utility';

const stockService = new StockService();

export class StockController {

  async getAllStockAction(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '8');
    const pagination = parseBoolean(req.query.noPagination as string) || true;
    const orderBy = req.query.orderBy as string || 'actionedAt';
    const orderDir = req.query.orderDir as string || 'desc';
    const productId = parseInt(req.query.productId as string);

    try {
      const stockActions = await stockService.findAll(page, pageSize, pagination, orderBy, orderDir, productId);
      sendResponse(res, 200, `Get all stock action ok`, stockActions.data, stockActions.meta);
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
    const { productId, userId, actionType, quantity, description } = req.body;

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

    if(isValidHaveValue([description])) {
      dataDto.description = description;
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

  async getAllStockSellAction(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '8');
    const pagination = parseBoolean(req.query.noPagination as string) || true;
    const orderBy = req.query.orderBy as string || 'actionedAt';
    const orderDir = req.query.orderDir as string || 'desc';
    const productId = parseInt(req.query.page as string);

    try {
      const stockSellActions = await stockService.findAllSell(page, pageSize, pagination, orderBy, orderDir, productId);
      sendResponse(res, 200, `Get all stock sell action ok`, stockSellActions.data, stockSellActions.meta)
    }
    catch (error: any) {
      console.error('Get all stock sell action error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  // async createNewStockSellAction(req: Request, res: Response) {
  //   const { productId, customerId, actionType, quantity } = req.body;

  //   if(!isValidHaveValue([productId, customerId, actionType, quantity])) {
  //     sendError(res, 400, `productId, customerId, actionType and quantity is required`);
  //   }

  //   if(!isValidId(productId)) {
  //     sendError(res, 400, `Product id must not zero or negative number`);
  //   }

  //   if(!isValidId(customerId)) {
  //     sendError(res, 400, `Customer id must not zero or negative number`);
  //   }

  //   const dataDto : createStockSellActionDto = {
  //     productId: productId,
  //     customerId: customerId,
  //     actionType: actionType,
  //     quantity: quantity
  //   }

  //   try {
  //     const newStockSellAction = await stockService.createSell(dataDto);
  //     sendResponse(res, 201, `Creating stock sell action ok`, newStockSellAction);
  //   }
  //   catch (error: any) {
  //     console.error('Creating stock sell action error: ', error);
  //     sendError(res, error.statusCode, error.message);
  //   }
  // }

}