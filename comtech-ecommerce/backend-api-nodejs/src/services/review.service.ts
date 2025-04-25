import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createReviewDto, updateReviewDto } from '../types';

const prisma = new PrismaClient();

export class ReviewService {

  async findAll(
    page: number, 
    pageSize: number,
    pagination: boolean = false,
    orderBy: string = 'createdAt',
    orderDir: string = 'desc',
    waitApproved: boolean
  ) {
    try { 
      let where: Prisma.ReviewWhereInput = {};
      if(waitApproved) {
        where.approved = null;
      }
      else {
        where.approved = {
          not: null
        }
      }

      const totalReviews = await prisma.review.findMany({ where });
      const totalPages = Math.ceil(totalReviews.length / pageSize);
      const reviews = await prisma.review.findMany({
        where,
        include: {
          product: {
            select: {
              name: true
            }
          },
          createdBy: {
            include: {
              customerDetail: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          [orderBy]: orderDir
        },
        skip: pagination ? (page - 1) * pageSize : undefined,
        take: pagination ? pageSize : undefined,
      });
      
      return {
        data: reviews,
        meta: {
          totalItems: totalReviews.length,
          totalPages: totalPages,
          currentPage: page,
          pageSize
        }
      };
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

  async update(reviewId: number, dto: updateReviewDto) {
    try {
      // ตรวจสอบ review มีอยู่จริง
      const findReview = await prisma.review.findUnique({ where: { id: reviewId } });
      if(!findReview) throw new exception.NotFoundException(`Not found review with id ${reviewId}`);

      let updateData : any = {};

      if(dto.message !== undefined) updateData.message = dto.message;
      if(dto.rating !== undefined) updateData.rating = dto.rating;

      const updateReview = await prisma.review.update({
        where: { id: reviewId },
        data: updateData
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

  async approve(reviewId: number, approve: boolean) {
    try {
      // ตรวจสอบ review มีอยู่จริง
      const findReview = await prisma.review.findUnique({ where: { id: reviewId } });
      if(!findReview) throw new exception.NotFoundException(`Not found review with id ${reviewId}`);

      const approveReview = await prisma.review.update({
        where: { id: reviewId },
        data: { approved: approve }
      });

      return approveReview;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error approving review due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async delete(reviewId: number) {
    try {
      // ตรวจสอบ review มีอยู่จริง
      const findReview = await prisma.review.findUnique({ where: { id: reviewId } });
      if(!findReview) throw new exception.NotFoundException(`Some review not found`);

      const deleteReview = await prisma.review.delete({
        where: { id: reviewId },
      });

      return deleteReview;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete reviews due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

}