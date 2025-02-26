import { PrismaClient, Prisma } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createProductDto, updateProductDto } from '../types';
import { generateUuidBasedSku } from '../libs/utility';

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

  async create(dto: createProductDto, userId: number) {
    try {
      // check sku later...

      const newProduct = await prisma.product.create({
        data: {
          createdBy: {
            connect: { id: userId }
          },
          sku: generateUuidBasedSku('NBK-'),
          name: dto.name,
          description: dto.description,
          brand: {
            connect: { id: dto.brandId }
          },
          price: dto.price,
          categories: {
            create: dto.categories.map(category => ({
              category: {
                connect: { 
                  id: category.categoryId,
                },
              },
              createBy: {
                connect: { id: userId }
              }
            }))
          },
          tags: dto.tags ? {
            create: dto.tags.map(tag => ({
              tag: {
                connect: {
                  id: tag.tagId
                }
              },
              createBy: {
                connect: { id: userId }
              }
            }))
          } : undefined,
          images: dto.images ? {
            create: dto.images.map((image, index) => ({
              url_path: image.url_path,
              sequence_order: index + 1,
              assignedBy: {
                connect: { id: userId }
              }
            }))
          } : undefined,
          specs: {
            create: {
              mainboard: dto.specs.mainboard,
              mainboardFeature: dto.specs.mainboardFeature,
              cpu: dto.specs.cpu,
              gpu: dto.specs.gpu,
              ram: dto.specs.ram,
              harddisk: dto.specs.harddisk,
              soundCard: dto.specs.soundCard,
              powerSupply: dto.specs.powerSupply,
              screenSize: dto.specs.screenSize,
              screenType: dto.specs.screenType,
              refreshRate: dto.specs.refreshRate,
              dimension: dto.specs.dimension,
              weight: dto.specs.weight,
              freeGift: dto.specs.freeGift
            }
          }
        },
        include: {
          brand: true,
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          specs: true,
          images: true
        }
      });
      return newProduct;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error create new product due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async updateOne(productId: number, dto: updateProductDto, userId: number) {
    try {
      const updateData: any = {};

      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ product มีอยู่จริง
      const findProduct = await prisma.product.findUnique({ where: { id: productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${productId}`);

      // ข้อมูลพื้นฐาน
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.price !== undefined) updateData.price = dto.price;

      // Brand relationship (one-to-many)
      if (dto.brandId !== undefined) {
        updateData.brand = {
          connect: { id: dto.brandId }
        };
      }

      // Categories relationship (many-to-many)
      if (dto.categories) {
        updateData.categories = {};
        
        if (dto.categories.connect?.length) {
          updateData.categories.create = dto.categories.connect.map(item => ({
            category: {
              connect: { id: item.categoryId }
            },
            createBy: {
              connect: { id: userId }
            }
          }));
        }
        
        if (dto.categories.disconnect?.length) {
          // ต้อง deleteMany เพราะเป็นความสัมพันธ์ many-to-many ที่มี join table
          updateData.categories.deleteMany = dto.categories.disconnect.map(item => ({
            categoryId: item.categoryId
          }));
        }
      }

      // Tags relationship (many-to-many)
      if (dto.tags) {
        updateData.tags = {};
        
        if (dto.tags.connect?.length) {
          updateData.tags.create = dto.tags.connect.map(item => ({
            tag: {
              connect: { id: item.tagId }
            },
            createBy: {
              connect: { id: userId }
            }
          }));
        }
        
        if (dto.tags.disconnect?.length) {
          updateData.tags.deleteMany = dto.tags.disconnect.map(item => ({
            tagId: item.tagId
          }));
        }
      }

      // Specs relationship (one-to-one)
      if (dto.specs) {
        updateData.specs = {
          update: dto.specs
        };
      }

      // Images relationship (one-to-many)
      if (dto.images) {
        updateData.images = {};
        
        if (dto.images.create?.length) {
          updateData.images.create = dto.images.create;
        }
        
        if (dto.images.delete?.length) {
          updateData.images.deleteMany = dto.images.delete.map(item => ({
            id: item.id
          }));
        }
      }

      updateData.updatedBy = {
        connect: { id: userId }
      } 

      // ทำการอัปเดต product
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: {
          brand: true,
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          specs: true,
          images: true
        }
      });
    
      return updatedProduct;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one product due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  /* รองรับทั้งแบบทำตัวเดียวและหลายตัว */
  async softDelete(productId: number[], userId: number) {
    try {
      const existingProducts = await prisma.product.findMany({
        where: { 
          id: { in: productId },
          deletedAt: null // ตรวจสอบว่ายังไม่ถูกลบไปแล้ว
        },
        select: { id: true }
      });

      if (existingProducts.length !== productId.length) {
        throw new exception.NotFoundException("Some products not found or already deleted");
      }

      const transaction = await prisma.$transaction(async (tx) => {
        const softDeleteProducts = [];

        for(const id of productId) {
          const action = await tx.product.update({
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

          softDeleteProducts.push(action);
        }

        return softDeleteProducts;
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error soft delete products due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Change images

  // Update images order


}