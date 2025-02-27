import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createReviewDto, updateReviewDto } from '../types';

const prisma = new PrismaClient();

export class ReviewService {

  async findAll(customerId?: number) {
    try { 
      const reviews = await prisma.review.findMany({
        where: customerId ? {
          id: customerId
        } : {}
      });
      return reviews;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all review due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findByProduct(productId: number) {
    try {
      const findProduct = await prisma.product.findUnique({ where: { id: productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${productId}`);

      const reviewsByProduct = await prisma.review.findMany({
        where: { productId: productId }
      });
      return reviewsByProduct;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find reviews by product due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(reviewId: number) {
    try {
      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if(!review) throw new exception.NotFoundException(`Not found review with id ${reviewId}`)
      return review;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one review due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(dto: createReviewDto, customerId: number) {
    try {
      // ตรวจสอบ customer มีอยู่จริง
      const findCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${customerId}`);

      const createReview = await prisma.review.create({
        data: {
          createdBy: {
            connect: { 
              id: customerId 
            }
          },
          product: {
            connect: {
              id: dto.productId
            }
          },
          message: dto.message,
          rating: dto.rating,
        }
      });

      return createReview;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating review due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updateOne(reviewId: number, dto: updateReviewDto, customerId: number) {
    try {
      // ตรวจสอบ customer มีอยู่จริง
      const findCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
      if(!findCustomer) throw new exception.NotFoundException(`Not found customer with id ${customerId}`);

      // ตรวจสอบ review มีอยู่จริง
      const findReview = await prisma.review.findUnique({ where: { id: reviewId } });
      if(!findReview) throw new exception.NotFoundException(`Not found review with id ${reviewId}`);

      const updateReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          message: dto.message,
          rating: dto.rating,
          updatedBy: {
            connect: {
              id: customerId
            }
          }
        }
      });

      return updateReview;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating review due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async softDelete(reviewId: number[], customerId: number) {
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

}