import { PrismaClient, Prisma, OrderStatus, PaymentStatus } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createOrderDto } from '../types';
import { StockService } from './stock.service';

const prisma = new PrismaClient();
const stockService = new StockService;

export class OrderService {

  async findAll() {
    try {
      const orders = await prisma.order.findMany({
        include: {
          customer: {
            include: {
              customerDetail: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                }
              },
              campaign: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      });
      return orders;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all order due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const findOrder = await prisma.order.findUnique({ where: { id: id } });
      if(!findOrder) throw new exception.NotFoundException(`Not found order with id ${id}`);
      return findOrder;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one order due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(dto: createOrderDto) {
    try {
      /**
       * Check value logic
       */
      // Check customerId, productId, campaignId is exsist
      const findCustomer = await prisma.customer.findUnique({ where: { id: dto.customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${dto.customerId}`);

      const productsId = dto.items.map(i => i.productId);
      const findProduct = await prisma.product.findMany({ where: { id: { in: productsId } } });
      if(!findProduct) throw new exception.NotFoundException(`Some product is not found`);

      dto.items.map(async i => {
        if(i.campaignId !== undefined) {
          const findCampaign = await prisma.campaign.findUnique({ where: { id: i.campaignId } });
          if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${i.campaignId}`);
        }
      });

      // Check product in stock is have enough
      const inStockErr : number[] = [];
      dto.items.map(async i => {
        const inStock = await prisma.inStock.findUnique({ where: { productId: i.productId } });
        if(inStock) {
          if(inStock.inStock - i.quantity < 0) {
            inStockErr.push(i.productId);
          }
        }
        else {
          throw new exception.NotFoundException(`Not found in stock with product id ${i.productId}`);
        }
      });

      if(inStockErr.length > 0) {
        throw new exception.BadRequestException(`Product with id ${inStockErr.map((i, index) => i + `${index < inStockErr.length ? ', ' : ''}`)} is not have enough for this order, please check in stock again`);
      }
      /** End check value */

      const transaction = await prisma.$transaction(async tx => {
        // reserve product in stock
        dto.items.map(async (i, index) => {
          const dataDto = {
            productId: i.productId,
            customerId: dto.customerId,
            actionType: 'RESERVE',
            quantity: i.quantity
          }
          await stockService.createSell(dataDto);
        })
      
        // create order
        const newOrder = await tx.order.create({
          data: {
            customer: { connect: { id: dto.customerId } },
            total: dto.total,
            orderItems: {
              create: dto.items.map(item => {
                const itemData : any = {
                  product: { connect: { id: item.productId } },
                  quantity: item.quantity,
                  sale_price: item.salePrice
                }

                if(item.campaignId !== undefined) {
                  itemData.campaign = { connect: { id: item.campaignId } };
                  itemData.discount = item.discount;
                }

                return itemData;
              })
            }
          }
        });

        return newOrder;
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating order due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updatePayment(orderId: number, paymentStatus: string) {
    try {
      const findOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if(!findOrder) throw new exception.NotFoundException(`Not found order with id ${orderId}`);

      const updatePayment = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: paymentStatus as OrderStatus,
          paymentStatus: paymentStatus as PaymentStatus,
          updatePaymentAt: new Date()
        }
      });

      return updatePayment;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update payment due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updateDelivery(orderId: number, deliveryStatus: string) {
    try {
      const findOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if(!findOrder) throw new exception.NotFoundException(`Not found order with id ${orderId}`);

      const updateDelivery = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: deliveryStatus as OrderStatus,
        }
      });

      return updateDelivery;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update delivery due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }
  
}