import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';

const prisma = new PrismaClient();

export class WishlistService {

  async add(customerId: number, productId: number) {
    try {
      // ตรวจสอบ customer มีอยู่จริง
      const findCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${customerId}`);

      // ตรวจสอบ product มีอยู่จริง
      const findProduct = await prisma.product.findUnique({ where: { id: productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${productId}`);

      const checkDuplicateWishlist = await prisma.wishlist.findMany({
        where: {
          productId: productId,
          customerId: customerId
        }
      });

      if(checkDuplicateWishlist.length > 0) {
        return;
      }

      const addWishlist = await prisma.wishlist.create({
        data: {
          customer: { connect: { id: customerId } },
          product: { connect: { id: productId } }
        }
      });

      return addWishlist;
      
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error add wishlist due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {

      // ตรวจสอบ customer มีอยู่จริง
      const findWishlist = await prisma.wishlist.findUnique({ where: { id: id } });
      if(!findWishlist) throw new exception.NotFoundException(`Not found wishlist with id ${id}`);
      
      const removeWishlist = await prisma.wishlist.delete({
        where: { id: id }
      });

      return removeWishlist;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error add wishlist due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

}