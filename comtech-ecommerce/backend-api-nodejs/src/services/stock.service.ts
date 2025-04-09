import { PrismaClient, Prisma, StockAction, StockSellAction } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createStockActionDto, createStockSellActionDto } from '../types';

const prisma = new PrismaClient();

export class StockService {

  async findAll() {
    try {
      const stockActions = await prisma.stockEvent.findMany({
        include: {
          product: true,
          actionedBy: true,
        }
      });
      return stockActions;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all stock action due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const stockAction = await prisma.stockEvent.findUnique({ 
        where: { id: id },
        include: { 
          product: true,
          actionedBy: true
        } 
      });
      if(!stockAction) throw new exception.NotFoundException(`Not found stock action with id ${id}`);
      return stockAction;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one stock action due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Add, remove for webadmin manage stock
  async create(dto: createStockActionDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ product มีอยู่จริง
      const findProduct = await prisma.product.findUnique({ where: { id: dto.productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${dto.productId}`);

      const findProductInStock = await prisma.inStock.findUnique({ where: { productId: dto.productId } });
      if(!findProductInStock) throw new exception.NotFoundException(`Not found in stock data with product id ${dto.productId}`);

      const transaction = await prisma.$transaction(async (tx) => {

        let currentInStock = findProductInStock.inStock;
        if(dto.actionType === StockAction.ADD) {
          currentInStock += dto.quantity;
        }
        else if(dto.actionType === StockAction.REMOVE) {
          currentInStock -= dto.quantity;
        }

        const inStock = await tx.inStock.update({
          where: { productId: dto.productId },
          data: { inStock: currentInStock }
        })

        const newStockAction = await tx.stockEvent.create({
          data: {
            action: dto.actionType as StockAction,
            quantity: dto.quantity,
            description: dto.description,
            product: { connect: { id: dto.productId } },
            actionedBy: { connect: { id: dto.userId } }
          }
        });

        return {inStock, newStockAction};
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating stock action due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findAllSell() {
    try {
      const stockSellActions = await prisma.stockSellEvent.findMany({
        include: {
          product: true,
          actionedBy: true,
        }
      });
      return stockSellActions;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all stock sell action due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Sell, reserve, cancel reserve for customer order
  async createSell(dto: createStockSellActionDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findCustomer = await prisma.customer.findUnique({ where: { id: dto.customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${dto.customerId}`);

      // ตรวจสอบ product มีอยู่จริง
      const findProduct = await prisma.product.findUnique({ where: { id: dto.productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${dto.productId}`);

      const findProductInStock = await prisma.inStock.findUnique({ where: { productId: dto.productId } });
      if(!findProductInStock) throw new exception.NotFoundException(`Not found in stock data with product id ${dto.productId}`);

      const transaction = await prisma.$transaction(async (tx) => {

        let currentInStock = findProductInStock.inStock;
        let currentTotalSale = findProductInStock.totalSaleQuantity;
        
        if(dto.actionType === StockSellAction.SELL) {
          currentTotalSale += dto.quantity;
        }
        else if(dto.actionType === StockSellAction.RESERVE) {
          currentInStock -= dto.quantity;
        }
        else if(dto.actionType === StockSellAction.CANCELRESERVE) {
          currentInStock += dto.quantity;
        }

        const inStock = await tx.inStock.update({
          where: { productId: dto.productId },
          data: { 
            inStock: currentInStock,
            totalSaleQuantity: currentTotalSale,
          }
        })

        const newStockSellAction = await tx.stockSellEvent.create({
          data: {
            action: dto.actionType as StockSellAction,
            quantity: dto.quantity,
            product: { connect: { id: dto.productId } },
            actionedBy: { connect: { id: dto.customerId } }
          }
        });

        return {inStock, newStockSellAction};
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating stock sell action due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }
}