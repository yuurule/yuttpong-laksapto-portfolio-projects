import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';

const prisma = new PrismaClient();

export class BrandService {

  async findAll() {
    try {
      const brands = await prisma.brand.findMany();
      return brands;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all brand due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(brandId: number) {
    try {
      const brand = await prisma.brand.findUnique({ where: { id: brandId } });
      if(!brand) throw new exception.NotFoundException(`Not found brand with id ${brandId}`)
      return brand;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one brand due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(brandName: string, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      const newBrand = await prisma.brand.create({
        data: {
          name: brandName,
          createdBy: {
            connect: { id: userId }
          }
        }
      });

      return newBrand;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating brand due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async update(brandId: number, brandName: string, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ tag มีอยู่จริง
      const findBrand = await prisma.brand.findUnique({ where: { id: brandId } });
      if(!findBrand) throw new exception.NotFoundException(`Not found brand with id ${brandId}`);

      const updateBrand = await prisma.brand.update({
        where: { id: brandId },
        data: {
          name: brandName,
          updatedBy: {
            connect: { id: userId }
          }
        }
      });

      return updateBrand;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one brand due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // soft delete
  async delete(brandId: number[], userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ brand มีอยู่จริง
      const findBrands = await prisma.brand.findMany({ where: { id: { in: brandId } } });
      if(!findBrands) throw new exception.NotFoundException(`Some brand not found`);

      const transaction = await prisma.$transaction(async (tx) => {
        const softDeleteBrands = [];

        for(const id of brandId) {
          const action = await tx.brand.update({
            where: { id: id },
            data: {
              deletedAt: new Date(),
              deletedBy: {
                connect: { id: userId }
              },
              updatedBy: {
                connect: { id: userId }
              }
            },
            select: {
              id: true,
              name: true,
              deletedAt: true,
            }
          });

          softDeleteBrands.push(action);
        }

        return softDeleteBrands;
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete brands due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

}