import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createCategoryDto } from '../types';

const prisma = new PrismaClient();

export class CategoryService {

  async findAll() {
    try {
      const categories = await prisma.category.findMany();
      return categories;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all category due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(categoryId: number) {
    try {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if(!category) throw new exception.NotFoundException(`Not found category with id ${categoryId}`)
      return category;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one category due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(dto: createCategoryDto, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      const newCategory = await prisma.category.create({
        data: {
          name: dto.name,
          description: dto.description,
          createdBy: {
            connect: { id: userId }
          }
        }
      });

      return newCategory;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating category due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async update(categoryId: number, dto: createCategoryDto, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ category มีอยู่จริง
      const findCategory = await prisma.category.findUnique({ where: { id: categoryId } });
      if(!findCategory) throw new exception.NotFoundException(`Not found category with id ${categoryId}`);

      const updateCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: dto.name,
          description: dto.description,
          updatedBy: {
            connect: { id: userId }
          }
        }
      });

      return updateCategory;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one category due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async delete(categoryId: number[], userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ category มีอยู่จริง
      const findCategory = await prisma.category.findMany({ where: { id: { in: categoryId } } });
      if(!findCategory) throw new exception.NotFoundException(`Some category not found`);

      const deleteCategories = await prisma.category.deleteMany({
        where: { id: { in: categoryId } },
      });

      return deleteCategories;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete categories due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

}