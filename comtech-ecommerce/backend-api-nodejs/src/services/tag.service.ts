import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createTagDto } from '../types';

const prisma = new PrismaClient();

export class TagService {

  async findAll() {
    try {

    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(newTag: createTagDto) {
    try {

    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating ___ due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updateOne(id: number, tag: createTagDto) {
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

  // Add tags to product

  // Remove tags from product
}