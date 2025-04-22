import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createCategoryDto } from '../types';

const prisma = new PrismaClient();

export class CategoryService {

  async findAll(
    orderBy?: string, 
    nameOrderBy?: string, 
    haveProductOrderBy?: string
  ) {
    try {

      const queryData : any = {
        include: {
          createdBy: {
            select: {
              displayName: true
            }
          },
          updatedBy: {
            select: {
              displayName: true
            }
          },
          products: true
        }
      }

      const orderByQuery = [];

      if(orderBy !== undefined) {
        orderByQuery.push({ createdAt: orderBy })
      }
      if(nameOrderBy !== undefined) {
        orderByQuery.push({ name: nameOrderBy })
      }
      if(haveProductOrderBy !== undefined) {
        orderByQuery.push({ products: { _count: haveProductOrderBy } })
      }

      queryData.orderBy = orderByQuery;

      const categories = await prisma.category.findMany(queryData);
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

  async statisticCategories(
    page: number, 
    pageSize: number,
    orderBy: string = 'createdAt', // 'createdAt', name
    orderDir: string = 'desc',
    search: string,
    productAmount: string, // 'desc', 'asc'
  ) {
    let where: Prisma.CategoryWhereInput = {};
    if(search) {
      where.name = {
        contains: search
      }
    }

    const totalCategories = await prisma.category.findMany({
      where,
    });

    const totalPages = Math.ceil(totalCategories.length / pageSize);
    let calculateTotalPages = 1;

    const categories = await prisma.category.findMany({
      where,
      include: {
        products: true,
      },
      orderBy: {
        [orderBy]: orderDir
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    let resultCategories: any;
    if(productAmount) {
      const allCategories = await prisma.category.findMany({ 
        where,
        include: {
          products: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate inStock, sale quantity, total sale
      let productAmountData = [];
      for(let i = 0; i < allCategories.length; i++) {
        let totalProductAmount = allCategories[i].products.length;
        productAmountData.push({
          id: allCategories[i].id,
          productAmount: totalProductAmount 
        });
      }

      if(productAmount === 'desc') { // มากไปน้อย
        productAmountData.sort((a: any, b: any) => {
          return (b.productAmount || 0) - (a.productAmount || 0);
        });
      }
      else if(productAmount === 'asc') { // น้อยไปมาก
        productAmountData.sort((a: any, b: any) => {
          return (a.productAmount || 0) - (b.productAmount || 0);
        });
      }

      //console.log(salesData);

      // Find all product have sale quanity with sorting by sale quantity
      const categoriesData = productAmountData.map((i: any) => {
        return allCategories.find(x => x.id === i.id);
      });

      // Manual calculate pagination
      let resultDataPage = [];
      let startIndex = page === 1 ? 1 : ((page - 1) * pageSize) + 1;
      let endIndex = page * pageSize;
      for(let i = 0; i < categoriesData.length; i++) {
        if(i + 1 >= startIndex && i + 1 <= endIndex) {
          resultDataPage.push(categoriesData[i]);
        }
      }

      calculateTotalPages = Math.ceil(categoriesData.length / pageSize);
      resultCategories = resultDataPage;
    }
    else {
      resultCategories = categories;
    }

    return {
      data: resultCategories,
      meta: {
        totalItems: productAmount ? resultCategories.length : totalCategories.length,
        totalPages: productAmount ? calculateTotalPages : totalPages,
        currentPage: page,
        pageSize
      }
    };
  }
}