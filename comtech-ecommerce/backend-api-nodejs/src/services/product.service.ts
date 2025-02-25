import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createProductDto } from '../types';

const prisma = new PrismaClient();

export class ProductService {

  async findAll() {
    try {
      const products = await prisma.product.findMany();
      return products;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all product due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(productId: number) {
    try {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if(!product) throw new exception.NotFoundException(`Not found product with id ${productId}`)
      return product;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one product due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(data: createProductDto) {
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          brandId: data.brandId,
          price: data.price,
          
          specs: {
            create: {
              mainboard: data.specs.mainboard,
              mainboardFeature: data.specs.mainboardFeature,
              cpu: data.specs.cpu,
              gpu: data.specs.gpu,
              ram: data.specs.ram,
              harddisk: data.specs.harddisk,
              soundCard: data.specs.soundCard,
              powerSupply: data.specs.powerSupply,
              screenSize: data.specs.screenSize,
              screenType: data.specs.screenType,
              refreshRate: data.specs.refreshRate,
              dimension: data.specs.dimension,
              weight: data.specs.weight,
              freeGift: data.specs.freeGift
            }
          }
        }
      });
      return newProduct;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updateOne(id: number, product: createProductDto) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async softDeleteOne(id: number) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error soft delete one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async softDeleteMany(id: number[]) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error soft delete one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async deleteOne(id: number) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async deleteMany(id: number[]) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Add images

  // Change image

  // Update images order

  // Remove image

}