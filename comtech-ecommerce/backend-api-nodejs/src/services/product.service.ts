import { PrismaClient, Prisma, StockSellAction } from '@prisma/client';
import * as exception from '../libs/errorException';
import { createProductDto, updateProductDto } from '../types';
import { generateUuidBasedSku } from '../libs/utility';
import fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/errorHandler';

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
          orderItems: {
            include: {
              order: {
                select: {
                  paymentStatus: true,
                  createdAt: true,
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

  async create(userId: number, productData: createProductDto, imageFiles: Express.Multer.File[] = []) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) {
        throw new AppError('Not found user with id ${userId}', 400);
      }

      // สร้างสินค้าใหม่
      const newProduct = await prisma.product.create({
        data: {
          createdBy: {
            connect: { id: userId }
          },
          sku: generateUuidBasedSku('NBK'),
          name: productData.name,
          description: productData.description,
          brand: {
            connect: { id: productData.brandId }
          },
          price: productData.price,
          publish: productData.publish,
          inStock: {
            create: {
              inStock: 0
            }
          },
          categories: {
            create: productData.categories.map(category => ({
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
          tags: productData.tags ? {
            create: productData.tags.map(tag => ({
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
          specs: {
            create: {
              screen_size: productData.specs.screen_size,
              processor: productData.specs.processor,
              display: productData.specs.display,
              memory: productData.specs.memory,
              storage: productData.specs.storage,
              graphic: productData.specs.graphic,
              operating_system: productData.specs.operating_system,
              camera: productData.specs.camera,
              optical_drive: productData.specs.optical_drive,
              connection_ports: productData.specs.connection_ports,
              wireless: productData.specs.wireless,
              battery: productData.specs.battery,
              color: productData.specs.color,
              dimension: productData.specs.dimension,
              weight: productData.specs.weight,
              warranty: productData.specs.warranty,
              option: productData.specs.option,
            }
          }
        }
      });
  
      // อัปโหลดรูปภาพถ้ามี
      if (imageFiles.length > 0) {
        await this.addProductImages(userId, newProduct.id, imageFiles);
      }
  
      // ดึงข้อมูลสินค้าพร้อมรูปภาพ
      return await this.findOne(newProduct.id);

    } catch (error) {
      // ลบไฟล์รูปภาพที่อัปโหลดแล้ว ในกรณีที่เกิดข้อผิดพลาด
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          try {
            await fsPromises.unlink(file.path);
          } catch (unlinkError) {
            console.error(`ไม่สามารถลบไฟล์ ${file.path}:`, unlinkError);
          }
        }
      }
      //console.log(`ไม่สามารถสร้างสินค้าได้: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`)
      throw new AppError(
        `ไม่สามารถสร้างสินค้าได้: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`,
        500
      );
    }
  }

  async update(productId: number, userId: number, productData: updateProductDto, imageFiles: Express.Multer.File[] = []) {
    try {
      const updateData: any = {};

      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ product มีอยู่จริง
      const findProduct = await prisma.product.findUnique({ where: { id: productId } });
      if(!findProduct) throw new exception.NotFoundException(`Not found product with id ${productId}`);

      // ข้อมูลพื้นฐาน
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;

      // Brand relationship (one-to-many)
      if (productData.brandId !== undefined) {
        updateData.brand = {
          connect: { id: productData.brandId }
        };
      }

      // Categories relationship (many-to-many)
      if (productData.categories) {
        updateData.categories = {};
        
        if (productData.categories.connect?.length) {
          updateData.categories.create = productData.categories.connect.map(item => ({
            category: {
              connect: { id: item.categoryId }
            },
            assignedBy: {
              connect: { id: userId }
            }
          }));
        }
        
        if (productData.categories.disconnect?.length) {
          // ต้อง deleteMany เพราะเป็นความสัมพันธ์ many-to-many ที่มี join table
          updateData.categories.deleteMany = productData.categories.disconnect.map(item => ({
            categoryId: item.categoryId
          }));
        }
      }

      // Tags relationship (many-to-many)
      if (productData.tags) {
        updateData.tags = {};
        
        if (productData.tags.connect?.length) {
          updateData.tags.create = productData.tags.connect.map(item => ({
            tag: {
              connect: { id: item.tagId }
            },
            assignedBy: {
              connect: { id: userId }
            }
          }));
        }
        
        if (productData.tags.disconnect?.length) {
          updateData.tags.deleteMany = productData.tags.disconnect.map(item => ({
            tagId: item.tagId
          }));
        }
      }

      // Specs relationship (one-to-one)
      if (productData.specs) {
        updateData.specs = {
          update: productData.specs
        };
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
              path: true,
              sequence_order: true,
            }
          }
        }
      });

      // จัดการกับข้อมูลรูป
      if (imageFiles.length > 0) {
        await this.addProductImages(userId, productId, imageFiles);
      }
      if(productData.imagesUpdate && productData.imagesUpdate.delete && productData.imagesUpdate.delete.length > 0) {
        await this.deleteProductImage(productData.imagesUpdate.delete);
      }

      return await this.findOne(productId);
    } catch (error) {
      // ลบไฟล์รูปภาพที่อัปโหลดแล้ว ในกรณีที่เกิดข้อผิดพลาด
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          try {
            await fsPromises.unlink(file.path);
          } catch (unlinkError) {
            console.error(`ไม่สามารถลบไฟล์ ${file.path}:`, unlinkError);
          }
        }
      }
      throw new AppError(
        `ไม่สามารถแก้ไขสินค้าได้: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`,
        500
      );
    }
  }

  // Add Images
  async addProductImages(userId: number, productId: number, imageFiles: Express.Multer.File[] = []) {
    try {
      // สร้างโฟลเดอร์สำหรับสินค้าใหม่
      const productDir = path.join('uploads/products', productId.toString());
      if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
      }

      // ย้ายไฟล์และอัปเดต path
      const updatedImageFiles = await Promise.all(imageFiles.map(async (file) => {
        // สร้าง path ใหม่
        const filename = path.basename(file.path);
        const newPath = path.join(productDir, filename);
        
        // ย้ายไฟล์
        await fsPromises.rename(file.path, newPath);
        
        // อัปเดต path ในไฟล์
        file.path = newPath;
        return file;
      }));

      // หาลำดับสูงสุดปัจจุบัน
      const maxOrderImage = await prisma.productImage.findFirst({
        where: { productId: productId },
        orderBy: { sequence_order: 'desc' },
      });

      let nextOrder = 1;
      if (maxOrderImage) {
        nextOrder = maxOrderImage.sequence_order + 1;
      }

      // สร้างข้อมูลรูปภาพ
      const imagePromises = updatedImageFiles.map(async (file, index) => {
        return prisma.productImage.create({
          data: {
            filename: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            sequence_order: nextOrder + index,
            product: {
              connect: {
                id: productId
              }
            },
            createdBy: {
              connect: {
                id: userId
              }
            }
          }
        });
      });

      // บันทึกข้อมูลรูปภาพทั้งหมดพร้อมกัน
      const productImages = await Promise.all(imagePromises);
      return productImages;
    } catch (error) {
      throw new AppError(
        `ไม่สามารถเพิ่มรูปภาพสินค้าได้: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`,
        500
      );
    }
  }

  // Delete Images
  async deleteProductImage(imagesId: number[]): Promise<void> {
    try {
      // ค้นหารูปภาพที่ต้องการลบ
      const images = await prisma.productImage.findMany({
        where: { 
          id: { 
            in: imagesId 
          } 
        }
      });
  
      if (!images) {
        throw new AppError('ไม่พบรูปภาพที่ต้องการลบ', 404);
      }
  
      // ลบไฟล์จริงจากระบบ
      for(let i = 0; i < images.length; i++) {
        try {
          await fsPromises.unlink(images[i].path);
        } catch (unlinkError) {
          console.error(`ไม่สามารถลบไฟล์ ${images[i].path}:`, unlinkError);
          // ทำการลบข้อมูลในฐานข้อมูลต่อไปแม้จะลบไฟล์ไม่สำเร็จ
        }
      }
  
      // ลบข้อมูลจากฐานข้อมูล
      await prisma.productImage.deleteMany({
        where: { id: { in: imagesId } }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `เกิดข้อผิดพลาดในการลบรูปภาพ: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`,
        500
      );
    }
  };

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

  // Webadmin statistic product
  async statisticProducts(
    page: number, 
    pageSize: number,
    orderBy: string = 'createdAt', // 'createdAt', name, price
    orderDir: string = 'desc',
    search?: string,
    inStock?: string, // 'desc', 'asc'
    sale?: string, // 'desc', 'asc'
    totalSale?: string, // 'desc', 'asc'
  ) {
    try {
      let where: Prisma.ProductWhereInput = {};

      where.deletedAt = null;

      if(search) {
        where.name = {
          contains: search
        }
      }

      const totalProducts = await prisma.product.findMany({
        where,
      });

      const totalPages = Math.ceil(totalProducts.length / pageSize);
      let calculateTotalPages = 1;

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
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      let resultProducts: any;
      if(inStock || sale || totalSale) {
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        // Calculate inStock, sale quantity, total sale
        let salesData = [];
        for(let i = 0; i < allProducts.length; i++) {
          let totalInStock = allProducts[i].inStock?.inStock ?? 0;
          let totalQuantity = 0;
          let totalSale = 0;
          allProducts[i].orderItems.map(x => {
            if(x.order.paymentStatus === 'PAID') {
              totalQuantity += x.quantity;
              totalSale += +x.sale_price * x.quantity;
            }
          });
          salesData.push({
            id: allProducts[i].id,
            inStock: totalInStock,
            sale: totalQuantity,
            totalSale: totalSale,
          });
        }

        // Sorting
        if(inStock) {
          if(inStock === 'desc') { // มากไปน้อย
            salesData.sort((a: any, b: any) => {
              return (b.inStock || 0) - (a.inStock || 0);
            });
          }
          else if(inStock === 'asc') { // น้อยไปมาก
            salesData.sort((a: any, b: any) => {
              return (a.inStock || 0) - (b.inStock || 0);
            });
          }
        }

        if(sale) {
          if(sale === 'desc') { // มากไปน้อย
            salesData.sort((a: any, b: any) => {
              return (b.sale || 0) - (a.sale || 0);
            });
          }
          else if(sale === 'asc') { // น้อยไปมาก
            salesData.sort((a: any, b: any) => {
              return (a.sale || 0) - (b.sale || 0);
            });
          }
        }
        
        if(totalSale) {
          if(totalSale === 'desc') { // มากไปน้อย
            salesData.sort((a: any, b: any) => {
              return (b.totalSale || 0) - (a.totalSale || 0);
            });
          }
          else if(totalSale === 'asc') { // น้อยไปมาก
            salesData.sort((a: any, b: any) => {
              return (a.totalSale || 0) - (b.totalSale || 0);
            });
          }
        }

        //console.log(salesData);

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

        calculateTotalPages = Math.ceil(productsData.length / pageSize);
        resultProducts = resultDataPage;
      }
      else {
        resultProducts = products;
      }

      return {
        data: resultProducts,
        meta: {
          totalItems: (inStock || sale || totalSale) ? resultProducts.length : totalProducts.length,
          totalPages: (inStock || sale || totalSale) ? calculateTotalPages : totalPages,
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

  async findAllInTrash(
    page: number, 
    pageSize: number, 
    orderBy: string = 'createdAt',
    orderDir: string = 'desc',
  ) {
    try {

      let where: Prisma.ProductWhereInput = {};

      where.deletedAt = {
        not: null
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        data: products,
        meta: {
          totalItems: totalProducts.length,
          totalPages: totalPages,
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
}