import { PrismaClient, Prisma, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/auth.config';
import { CustomerAuthTokens, CustomerTokenPayload, Customer } from '../types/auth.types';
import * as metrics from '../config/metrics.config';
import ms from 'ms';
import * as exception from '../libs/errorException';

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

    const result : CustomerAuthTokens = { 
      user: {
        id: customer.id,
      }, 
      accessToken, 
      refreshToken 
    };

    return result;
  }

  async findAll() {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          customerDetail: true,
          orders: true,
          cartItems: true,
          createdReviews: true,
          stockSellEvents: true,
          wishlists: true
        }
      });
      return customers;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all customer due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(customerId: number) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          customerDetail: true,
          orders: true,
          cartItems: true,
          createdReviews: {
            include: {
              product: { select: { name: true } }
            }
          },
          stockSellEvents: true,
          wishlists: {
            include: {
              product: { select: { name: true } }
            }
          }
        }
      });

      if(!customer) throw new exception.NotFoundException(`Not found campaign with id ${customerId}`);
      return customer;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all customer due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }
}