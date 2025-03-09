import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/auth.config';
import { CustomerAuthTokens, CustomerTokenPayload, Customer } from '../types/auth.types';
import * as metrics from '../config/metrics.config';
import ms from 'ms';

const prisma = new PrismaClient();

export class CustomerService {
  async register(email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const customer = await prisma.customer.create({
        data: {
          email,
          password: hashedPassword,
          lastActive: new Date(),
          customerDetail: {
            create: {}
          }
        },
      });

      const tokens = await this.generateTokens(customer);
      return tokens;
    }
    catch (error: any) {
      throw error;
    }
  }
  
  async login(email: string, password: string) {
    try {
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) {
        throw new Error('User not found');
      }
  
      const isValidPassword = await bcrypt.compare(password, customer.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
  
      const tokens = await this.generateTokens(customer);
      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async refresh(refreshToken: string): Promise<CustomerAuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        AUTH_CONFIG.JWT_REFRESH_SECRET
      ) as CustomerTokenPayload;

      const storedToken = await prisma.customerRefreshToken.findFirst({
        where: {
          token: refreshToken,
          customerId: decoded.customerId,
        },
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.customer.findUnique({
        where: { id: decoded.customerId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Delete old refresh token
      await prisma.customerRefreshToken.delete({
        where: { id: storedToken.id },
      });

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await prisma.customerRefreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(customer: Customer): Promise<CustomerAuthTokens> {
    const payload: CustomerTokenPayload = {
      customerId: customer.id,
      email: customer.email,
    };

    const accessToken = jwt.sign(
      payload,
      AUTH_CONFIG.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      payload, 
      AUTH_CONFIG.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    const refreshTokenExpiry = ms('7d');
    await prisma.customerRefreshToken.create({
      data: {
        token: refreshToken,
        customerId: customer.id,
        expiresAt: new Date(Date.now() + refreshTokenExpiry),
      },
    });

    return { accessToken, refreshToken };
  }
}