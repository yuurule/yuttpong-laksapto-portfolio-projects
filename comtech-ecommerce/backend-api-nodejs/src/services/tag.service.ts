import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';

const prisma = new PrismaClient();

export class TagService {

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

      const tags = await prisma.tag.findMany(queryData);
      return tags;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all tag due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(tagId: number) {
    try {
      const tag = await prisma.tag.findUnique({ where: { id: tagId } });
      if(!tag) throw new exception.NotFoundException(`Not found tag with id ${tagId}`)
      return tag;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one tag due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(tagName: string, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      const newTag = await prisma.tag.create({
        data: {
          name: tagName,
          createdBy: {
            connect: { id: userId }
          }
        }
      });

      return newTag;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating tag due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async update(tagId: number, tagName: string, userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ tag มีอยู่จริง
      const findTag = await prisma.tag.findUnique({ where: { id: tagId } });
      if(!findTag) throw new exception.NotFoundException(`Not found tag with id ${tagId}`);

      const updateTag = await prisma.tag.update({
        where: { id: tagId },
        data: {
          name: tagName,
          updatedBy: {
            connect: { id: userId }
          }
        }
      });

      return updateTag;

    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one tag due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async delete(tagId: number[], userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ tag มีอยู่จริง
      const findTags = await prisma.tag.findMany({ where: { id: { in: tagId } } });
      if(!findTags) throw new exception.NotFoundException(`Some tag not found`);

      const deleteTags = await prisma.tag.deleteMany({
        where: { id: { in: tagId } },
      });

      return deleteTags;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error delete tags due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async statisticTags(
    page: number, 
    pageSize: number,
    orderBy: string = 'createdAt', // 'createdAt', name
    orderDir: string = 'desc',
    search: string,
    productAmount: string, // 'desc', 'asc'
  ) {
    let where: Prisma.TagWhereInput = {};
    if(search) {
      where.name = {
        contains: search
      }
    }

    const totalTags = await prisma.tag.findMany({
      where,
    });

    const totalPages = Math.ceil(totalTags.length / pageSize);
    let calculateTotalPages = 1;

    const tags = await prisma.tag.findMany({
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

    let resultTags: any;
    if(productAmount) {
      const allTags = await prisma.tag.findMany({ 
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
      for(let i = 0; i < allTags.length; i++) {
        let totalProductAmount = allTags[i].products.length;
        productAmountData.push({
          id: allTags[i].id,
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
      const tagsData = productAmountData.map((i: any) => {
        return allTags.find(x => x.id === i.id);
      });

      // Manual calculate pagination
      let resultDataPage = [];
      let startIndex = page === 1 ? 1 : ((page - 1) * pageSize) + 1;
      let endIndex = page * pageSize;
      for(let i = 0; i < tagsData.length; i++) {
        if(i + 1 >= startIndex && i + 1 <= endIndex) {
          resultDataPage.push(tagsData[i]);
        }
      }

      calculateTotalPages = Math.ceil(tagsData.length / pageSize);
      resultTags = resultDataPage;
    }
    else {
      resultTags = tags;
    }

    return {
      data: resultTags,
      meta: {
        totalItems: productAmount ? resultTags.length : totalTags.length,
        totalPages: productAmount ? calculateTotalPages : totalPages,
        currentPage: page,
        pageSize
      }
    };
  }
}