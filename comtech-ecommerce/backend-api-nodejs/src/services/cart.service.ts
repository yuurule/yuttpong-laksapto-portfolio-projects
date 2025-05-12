import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createCartItemDto } from '../types';

const prisma = new PrismaClient();

export class CartService {

  async findAll() {
    try {
      const cartItems = await prisma.cartItem.findMany();
      return cartItems;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all cart item due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findAllByCustomerId(customerId: number) {
    try {
      const findCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${customerId}`);

      const cartItems = await prisma.cartItem.findMany({
        where: { customerId: customerId },
        include: {
          product: {
            include: {
              images: true,
              inStock: true,
              campaignProducts: {
                include: {
                  campaign: true
                }
              }
            }
          },
          customer: {
            include: {
              customerDetail: true
            }
          }
        }
      });

      return cartItems;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all cart item by customer due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(dto: createCartItemDto) {
    try {
      const findCustomer = await prisma.customer.findUnique({ where: { id: dto.customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${dto.customerId}`);

      const findProduct = await prisma.product.findUnique({ where: { id: dto.productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${dto.productId}`);

      const newCartItem = await prisma.cartItem.create({
        data: {
          customer: { connect: { id: dto.customerId } },
          product: { connect: { id: dto.productId } },
          quantity: dto.quantity
        }
      });

      return newCartItem;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating cart item due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async update(cartItemId: number, quantity: number, actionType: string) {
    try {
      const findCartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
      if(!findCartItem) throw new exception.NotFoundException(`Not found cart item with id ${cartItemId}`);

      const updateQuantity = () => {
        if(actionType === 'add') {
          return findCartItem.quantity += quantity;
        }
        else {
          return quantity;
        }
      }

      const updateCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { 
          quantity: updateQuantity()
        }
      });

      return updateCartItem;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async delete(cartItemsId: number[]) {
    try {
      const findCartItems = await prisma.cartItem.findMany({ where: { id: { in: cartItemsId } } });
      if(!findCartItems) throw new exception.NotFoundException(`Some cart item not found`);

      const deleteCartItems = await prisma.cartItem.deleteMany({ where: { id: { in: cartItemsId } } });

      return deleteCartItems;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

}