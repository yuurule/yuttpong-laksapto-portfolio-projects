import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';

const customerService = new CustomerService();

export class CustomerController {

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await customerService.register(email, password);
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

}