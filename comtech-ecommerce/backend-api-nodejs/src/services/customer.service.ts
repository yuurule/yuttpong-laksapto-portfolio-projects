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

  async register(email: string, password: string, displayName: string) {
    try {
      const checkEmailDuplicate = await prisma.customer.findUnique({
        where: {
          email: email
        }
      });

      if(checkEmailDuplicate) {
        throw new exception.DuplicateException(`This email is already used, try other email`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const customer = await prisma.customer.create({
        data: {
          email,
          password: hashedPassword,
          displayName,
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
      if(error instanceof exception.DuplicateException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete categories due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
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
      displayName: customer.displayName,
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
        displayName: customer.displayName,
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

  async statisticCustomer(
    page: number, 
    pageSize: number,
    orderBy: string = 'createdAt', // 'createdAt', name
    orderDir: string = 'desc',
    search: string,
    totalExpense: string, // 'desc', 'asc'
  ) {
    let where: Prisma.CustomerWhereInput = {};
    if(search) {
      where.OR = [
        {
          displayName: {
            contains: search
          }
        },
        {
          customerDetail: {
            OR: [
              {
                firstName: {
                  contains: search
                }
              },
              {
                lastName : {
                  contains: search
                }
              }
            ]
          }
        }
      ]
      // where.displayName = {
      //   contains: search
      // }
      
      // where.customerDetail = {
      //   firstName: {
      //     contains: search
      //   },
      //   lastName : {
      //     contains: search
      //   }
      // }
    }

    const totalCustomers = await prisma.customer.findMany({ where });
    const totalPages = Math.ceil(totalCustomers.length / pageSize);
    let calculateTotalPages = 1;

    const customers = await prisma.customer.findMany({
      where,
      include: {
        customerDetail: true,
        orders: true,
        cartItems: true,
        createdReviews: true,
        stockSellEvents: true,
        wishlists: true
      },
      orderBy: {
        [orderBy]: orderDir
      }
    });

    let resultData: any;
    if(totalExpense) {
      const allCustomers = await prisma.customer.findMany({ 
        where,
        include: {
          customerDetail: true,
          orders: true,
          cartItems: true,
          createdReviews: true,
          stockSellEvents: true,
          wishlists: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate inStock, sale quantity, total sale
      let expenseData = [];
      for(let i = 0; i < allCustomers.length; i++) {
        let totalExpense = 0;
        allCustomers[i].orders.map((x: any) => {
          if(x.paymentStatus === 'PAID') {
            totalExpense += +x.total;
          }
        })
        expenseData.push({
          id: allCustomers[i].id,
          totalExpense: totalExpense 
        });
      }

      if(totalExpense === 'desc') { // มากไปน้อย
        expenseData.sort((a: any, b: any) => {
          return (b.totalExpense || 0) - (a.totalExpense || 0);
        });
      }
      else if(totalExpense === 'asc') { // น้อยไปมาก
        expenseData.sort((a: any, b: any) => {
          return (a.totalExpense || 0) - (b.totalExpense || 0);
        });
      }

      //console.log(expenseData);

      // Find all product have sale quanity with sorting by sale quantity
      const calPageData = expenseData.map((i: any) => {
        return allCustomers.find(x => x.id === i.id);
      });

      // Manual calculate pagination
      let resultDataPage = [];
      let startIndex = page === 1 ? 1 : ((page - 1) * pageSize) + 1;
      let endIndex = page * pageSize;
      for(let i = 0; i < calPageData.length; i++) {
        if(i + 1 >= startIndex && i + 1 <= endIndex) {
          resultDataPage.push(calPageData[i]);
        }
      }

      calculateTotalPages = Math.ceil(calPageData.length / pageSize);
      resultData = resultDataPage;
    }
    else {
      resultData = customers;
    }

    return {
      data: resultData,
      meta: {
        totalItems: totalExpense ? resultData.length : totalCustomers.length,
        totalPages: totalExpense ? calculateTotalPages : totalPages,
        currentPage: page,
        pageSize
      }
    };
  }
}