import { PrismaClient, Prisma, StockAction, StockSellAction } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createProductDto, updateProductDto } from '../types';
import { generateUuidBasedSku } from '../libs/utility';

const prisma = new PrismaClient();

export class ProductService {

  async findAll(
    page: number, 
    pageSize: number, 
    noPagiation: boolean, 
    orderBy: string = 'createdAt',
    orderDir: string = 'desc',
    search?: string,
    brands?: number[],
    categories?: number[],
    tags?: number[],
    onSale?: boolean,
    topSale?: string,
    campaigns?: number[],
  ) {
    try {

      let where: Prisma.ProductWhereInput = {};

      // const salesData = await prisma.orderItem.groupBy({
      //   by: ['productId'],
      //   _sum: {
      //     quantity: true
      //   }
      // });

      // if(topSale) {
      //   if(topSale === 'desc') {
      //     salesData.sort((a, b) => {
      //       return (b._sum.quantity || 0) - (a._sum.quantity || 0);
      //     });
      //   }
      //   else if(topSale === 'asc') {
      //     salesData.sort((a, b) => {
      //       return (a._sum.quantity || 0) - (b._sum.quantity || 0);
      //     });
      //   }
      //   const productIds = salesData.map(item => item.productId);
      //   console.log(productIds);
      //   where.id = {
      //     in: productIds
      //   }
      // }

      if(brands) {
        if(brands.length === 0) where.brandId = -1;
        else {
          where.brandId = {
            in: brands
          }
        }
      }
      if(categories) {
        if(categories.length === 0) where.categories = {}
        else {
          where.categories = {
            some: {
              categoryId: {
                in: categories
              }
            }
          }
        }
      }
      if(tags) {
        if(tags.length === 0) where.tags = {};
        else {
          where.tags = {
            some: {
              tagId: {
                in: tags
              }
            }
          }
        }
      }
      if(search) {
        where.name = {
          contains: search
        }
      }

      if(campaigns) {
        if(campaigns.length === 0) where.campaignProducts = {}
        else {
          where.campaignProducts = {
            some: {
              campaignId: {
                in: campaigns
              }
            }
          }
        }
      }

      if(onSale) {
        where.campaignProducts = {
          some: {}
        }
      }

      const totalProducts = await prisma.product.findMany({
        where,
        include: {
          specs: true,
          categories: { include: { category: { select: { id: true, name: true } } } },
          tags: { include: { tag: { select: { id: true, name: true } } } },
          images: true,
          inStock: true,
          stockSellEvents: {
            where: {
              action: StockSellAction.SELL
            } 
          },
          reviews: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          orderItems: true,
          campaignProducts: {
            include: {
              campaign: true
            }
          }
        }
      });

      const totalPages = Math.ceil(totalProducts.length / pageSize);
      let topSaleTotalPages = 1;

      const products = await prisma.product.findMany({
        where,
        include: {
          specs: true,
          categories: { include: { category: { select: { id: true, name: true } } } },
          tags: { include: { tag: { select: { id: true, name: true } } } },
          images: true,
          inStock: true,
          stockSellEvents: {
            where: {
              action: StockSellAction.SELL
            } 
          },
          reviews: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          orderItems: {
            include: {
              order: {
                select: {
                  paymentStatus: true
                }
              }
            }
          },
          campaignProducts: {
            include: {
              campaign: true
            }
          }
        },
        orderBy: {
          [orderBy]: orderDir
        },
        skip: !noPagiation ? (page - 1) * pageSize : undefined,
        take: !noPagiation ? pageSize : undefined,
      });

      let resultProducts;

      if(topSale) {
        const allProducts = await prisma.product.findMany({
          where,
          include: {
            specs: true,
            categories: { include: { category: { select: { id: true, name: true } } } },
            tags: { include: { tag: { select: { id: true, name: true } } } },
            images: true,
            inStock: true,
            stockSellEvents: {
              where: {
                action: StockSellAction.SELL
              } 
            },
            reviews: {
              orderBy: {
                createdAt: 'desc'
              }
            },
            orderItems: {
              include: {
                order: {
                  select: {
                    paymentStatus: true
                  }
                }
              }
            },
            campaignProducts: {
              include: {
                campaign: true
              }
            }
          }
        });

        // Calculate sale quantity
        let salesData = [];
        for(let i = 0; i < allProducts.length; i++) {
          let totalQuantity = 0;
          allProducts[i].orderItems.map(x => {
            if(x.order.paymentStatus === 'PAID') {
              totalQuantity += x.quantity
            }
          });
          if(totalQuantity > 0) {
            salesData.push({
              id: allProducts[i].id,
              quantity: totalQuantity,
            });
          }
        }

        // Sorting
        if(topSale === 'desc') { // มากไปน้อย
          salesData.sort((a: any, b: any) => {
            return (b.quantity || 0) - (a.quantity || 0);
          });
        }
        else if(topSale === 'asc') { // น้อยไปมาก
          salesData.sort((a: any, b: any) => {
            return (a.quantity || 0) - (b.quantity || 0);
          });
        }

        // Find all product have sale quanity with sorting by sale quantity
        const productsData = salesData.map((i: any) => {
          return allProducts.find(x => x.id === i.id);
        });

        // Manual calculate pagination
        let resultDataPage = [];
        
        let startIndex = page === 1 ? 1 : ((page - 1) * pageSize) + 1;
        let endIndex = page * pageSize;
        for(let i = 0; i < productsData.length; i++) {
          if(i + 1 >= startIndex && i + 1 <= endIndex) {
            resultDataPage.push(productsData[i]);
          }
        }

        topSaleTotalPages = Math.ceil(productsData.length / pageSize);
        resultProducts = resultDataPage;
      }
      else {
        resultProducts = products;
      }

      return {
        data: resultProducts,
        meta: {
          totalItems: topSale ? resultProducts.length : totalProducts.length,
          totalPages: topSale ? topSaleTotalPages : totalPages,
          currentPage: page,
          pageSize
        }
      };
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
      const product = await prisma.product.findUnique({ 
        where: { id: productId },
        include: {
          specs: true,
          categories: { include: { category: { select: { id: true, name: true } } } },
          tags: { include: { tag: { select: { id: true, name: true } } } },
          images: true,
          inStock: true,
          stockSellEvents: {
            where: {
              action: StockSellAction.SELL
            } 
          },
          reviews: {
            include: {
              createdBy: {
                include: {
                  customerDetail: {
                    select: {
                      firstName: true,
                      lastName: true,
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          orderItems: true,
          campaignProducts: {
            include: {
              campaign: true
            }
          }
        }
      });
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
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // check sku later...

      const newProduct = await prisma.product.create({
        data: {
          createdBy: {
            connect: { id: userId }
          },
          sku: generateUuidBasedSku('NBK'),
          name: dto.name,
          description: dto.description,
          brand: {
            connect: { id: dto.brandId }
          },
          price: dto.price,
          publish: dto.publish,
          inStock: {
            create: {
              inStock: 0
            }
          },
          categories: {
            create: dto.categories.map(category => ({
              category: {
                connect: { 
                  id: category.categoryId,
                },
              },
              assignedBy: {
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
              assignedBy: {
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
              screen_size: dto.specs.screen_size,
              processor: dto.specs.processor,
              display: dto.specs.display,
              memory: dto.specs.memory,
              storage: dto.specs.storage,
              graphic: dto.specs.graphic,
              operating_system: dto.specs.operating_system,
              camera: dto.specs.camera,
              optical_drive: dto.specs.optical_drive,
              connection_ports: dto.specs.connection_ports,
              wireless: dto.specs.wireless,
              battery: dto.specs.battery,
              color: dto.specs.color,
              dimension: dto.specs.dimension,
              weight: dto.specs.weight,
              warranty: dto.specs.warranty,
              option: dto.specs.option,
            }
          }
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
            }
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          specs: true,
          images: {
            select: {
              id: true,
              url_path: true,
              sequence_order: true,
            }
          }
        }
      });
      return newProduct;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
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
            assignedBy: {
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
            assignedBy: {
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
          updateData.images.create = dto.images.create.map(item => ({
            url_path: item.url_path,
            sequence_order: item.sequence_order,
            assignedBy: {
              connect: { id: userId }
            }
          }));
        }
        
        if (dto.images.delete?.length) {
          updateData.images.deleteMany = dto.images.delete.map(item => ({
            id: item.id
          }));
        }

        // update images ...
      }

      updateData.updatedBy = {
        connect: { id: userId }
      } 

      // ทำการอัปเดต product
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
            }
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                }
              },
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                }
              },
            }
          },
          specs: true,
          images: {
            select: {
              id: true,
              url_path: true,
              sequence_order: true,
            }
          }
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

  /* soft delete รองรับทั้งแบบทำตัวเดียวและหลายตัว */
  async softDelete(productId: number[], userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ product มีอยู่จริง
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

}