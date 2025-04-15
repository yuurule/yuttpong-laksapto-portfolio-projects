import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { sendResponse, sendError } from '../libs/response';
import * as exception from '../libs/errorException';

const customerService = new CustomerService();

export class CustomerController {

  async register(req: Request, res: Response) {
    try {
      const { email, password, displayName } = req.body;
      const tokens = await customerService.register(email, password, displayName);
      res.json(tokens);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await customerService.login(email, password);
      res.json(tokens);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await customerService.refresh(refreshToken);
      res.json(tokens);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await customerService.logout(refreshToken);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCustomers(req: Request, res: Response) {
    try {
      const customers = await customerService.findAll();
      sendResponse(res, 200, `Get all customer ok`, customers)
    }
    catch (error: any) {
      console.error('Get all customer error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneCustomer(req: Request, res: Response) {
    const customerId = parseInt(req.params.id);

    try {
      if(!isValidId(customerId)) {
        throw new exception.BadRequestException(`Customer id must not zero or negative number`); 
      }
      
      const customer = await customerService.findOne(customerId);
      sendResponse(res, 200, `Get one customer ok`, customer)
    }
    catch (error: any) {
      console.error('Get one customer error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }
}