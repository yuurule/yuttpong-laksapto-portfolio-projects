import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { ProductService } from '../services/product.service';
import { createProductDto, updateProductDto } from '../types';
import { parseBoolean } from '../libs/utility';
import { AppError, catchAsync } from '../utils/errorHandler';
import fs from 'fs/promises';

const productService = new ProductService();

export class ProductController {

  async getProducts(req: Request, res: Response) {
    // pagination
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '12');
    const noPagination = parseBoolean(req.query.noPagination as string) || false;

    // filtering
    const search = req.query.search as string;
    const brandsId = req.query.brands as string;
    const categoriesId = req.query.categories as string;
    const tagsId = req.query.tags as string;
    const onSale = parseBoolean(req.query.onSale as string) || false;
    const campaignsId = req.query.campaigns as string;
    const topSale = req.query.topSale as string;

    // sorting
    const orderBy = req.query.orderBy as string || 'createdAt';
    const orderDir = req.query.orderDir as string || 'desc';

    let brands : number[] = [];
    if(brandsId) {
      brands = brandsId.split(',').map(id => {
        const parsed = parseInt(id.trim(), 10);
        if(!isValidId(parsed)) {
          sendError(res, 400, `Brand id must not zero or negative number`);
        }
        return parsed;
      })
    }

    let categories : number[] = [];
    if(categoriesId) {
      categories = categoriesId.split(',').map(id => {
        const parsed = parseInt(id.trim(), 10);
        if(!isValidId(parsed)) {
          sendError(res, 400, `Category id must not zero or negative number`);
        }
        return parsed;
      })
    }

    let tags : number[] = [];
    if(tagsId) {
      tags = tagsId.split(',').map(id => {
        const parsed = parseInt(id.trim(), 10);
        if(!isValidId(parsed)) {
          sendError(res, 400, `Tag id must not zero or negative number`);
        }
        return parsed;
      })
    }

    let campaigns : number[] = [];
    if(campaignsId) {
      campaigns = campaignsId.split(',').map(id => {
        const parsed = parseInt(id.trim(), 10);
        if(!isValidId(parsed)) {
          sendError(res, 400, `Campaign id must not zero or negative number`);
        }
        return parsed;
      })
    }

    const products = await productService.findAll(page, pageSize, noPagination, orderBy, orderDir, search, brands, categories, tags, onSale, topSale, campaigns);
    sendResponse(res, 200, `Get all product ok`, products.data, products.meta);
  }

  async getOneProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    try {
      const product = await productService.findOne(id);
      sendResponse(res, 200, `Get product by id ok`, product)
    }
    catch (error: any) {
      console.error('Get product by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  createNewProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { 
      userId, 
      name, 
      description, 
      brandId, 
      price, 
      publish,
      categories, 
      tags, 
      specs, 
      images 
    } = req.body;

    const categoriesData = JSON.parse(categories);
    const tagsData = JSON.parse(tags);
    const specsData = JSON.parse(specs);

    const {
      screen_size,
      processor,
      display,
      memory,
      storage,
      graphic,
      operating_system,
      camera,
      optical_drive,
      connection_ports,
      wireless,
      battery,
      color,
      dimension,
      weight,
      warranty,
      option,
    } = specsData;

    const removeUploadImages = async () => {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files as Express.Multer.File[]) {
          try {
            await fs.unlink(file.path);
          } catch (error) {
            console.error(`ไม่สามารถลบไฟล์ ${file.path}:`, error);
          }
        }
      }
    }

    if(!isValidHaveValue([userId, name, description, brandId, price, categoriesData, specs])) {
      removeUploadImages();
      return next(new AppError('userId, name, description, brandId, price, categories and specs is required', 400));
    }
    if(!isValidHaveValue([screen_size, processor, display, memory, storage, graphic, operating_system, camera, optical_drive, connection_ports, wireless, battery, color, dimension, weight, warranty, option])) {
      removeUploadImages();
      return next(new AppError('Some data in specs is missing', 400));
    }

    if(!isValidId(userId)) {
      removeUploadImages();
      return next(new AppError('User id must not zero or negative number', 400));
    }

    if(!isValidId(brandId)) {
      removeUploadImages();
      return next(new AppError('Brand id must not zero or negative number', 400));
    }

    const data : createProductDto = {
      name: name,
      description: description,
      brandId: Number(brandId),
      price: Number(price),
      publish: Boolean(publish),
      categories: categoriesData,
      specs: {
        screen_size: screen_size,
        processor: processor,
        display: screen_size,
        memory: memory,
        storage: storage,
        graphic: graphic,
        operating_system: operating_system,
        camera: camera,
        optical_drive: optical_drive,
        connection_ports: connection_ports,
        wireless: wireless,
        battery: battery,
        color: color,
        dimension: dimension,
        weight: weight,
        warranty: warranty,
        option: option
      }
    }

    if(isValidHaveValue([tagsData])) {
      data.tags = tagsData;
    }
    if(isValidHaveValue([images])) {
      data.images = images;
    }

    const newProduct = await productService.create(
      Number(userId), 
      data, 
      Array.isArray(req.files) ? req.files : []
    );

    res.status(201).json({
      status: 'success',
      RESULT_DATA: { newProduct }
    });
  });

  // async updateProduct(req: Request, res: Response) {
  //   const id = parseInt(req.params.id);
  //   const { 
  //     userId, 
  //     name, 
  //     description, 
  //     brandId, 
  //     price, 
  //     categories, 
  //     tags, 
  //     specs, 
  //     images 
  //   } = req.body;
    
  //   const {
  //     screen_size,
  //     processor,
  //     display,
  //     memory,
  //     storage,
  //     graphic,
  //     operating_system,
  //     camera,
  //     optical_drive,
  //     connection_ports,
  //     wireless,
  //     battery,
  //     color,
  //     dimension,
  //     weight,
  //     warranty,
  //     option,
  //   } = specs;

  //   if(!isValidId(id)) {
  //     sendError(res, 400, `Product id must not zero or negative number`);
  //   }

  //   if(!isValidHaveValue([userId])) {
  //     sendError(res, 400, `userId is required`);
  //   }

  //   const data : updateProductDto = {
  //     name: name,
  //     description: description,
  //     brandId: brandId,
  //     price: price,
  //     categories: categories,
  //     specs: {
  //       screen_size: screen_size,
  //       processor: processor,
  //       display: display,
  //       memory: memory,
  //       storage: storage,
  //       graphic: graphic,
  //       operating_system: operating_system,
  //       camera: camera,
  //       optical_drive: optical_drive,
  //       connection_ports: connection_ports,
  //       wireless: wireless,
  //       battery: battery,
  //       color: color,
  //       dimension: dimension,
  //       weight: weight,
  //       warranty: warranty,
  //       option: option
  //     }
  //   }

  //   if(isValidHaveValue([tags])) {
  //     data.tags = tags;
  //   }
  //   if(isValidHaveValue([images])) {
  //     data.images = images;
  //   }

  //   try {
  //     const updateProduct = await productService.updateOne(id, data, userId);
  //     sendResponse(res, 200, `Updating product ok`, updateProduct)
  //   }
  //   catch (error: any) {
  //     console.error('Updating product error: ', error);
  //     sendError(res, error.statusCode, error.message);
  //   }
  // }

  updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const { 
      userId, 
      name, 
      description, 
      brandId, 
      price, 
      categories, 
      tags, 
      specs, 
      imagesUpdate // delete
    } = req.body;

    const categoriesData = JSON.parse(categories);
    const tagsData = JSON.parse(tags);
    const specsData = JSON.parse(specs);
    const imagesUpdateData = JSON.parse(imagesUpdate);

    const {
      screen_size,
      processor,
      display,
      memory,
      storage,
      graphic,
      operating_system,
      camera,
      optical_drive,
      connection_ports,
      wireless,
      battery,
      color,
      dimension,
      weight,
      warranty,
      option,
    } = specsData;

    const removeUploadImages = async () => {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files as Express.Multer.File[]) {
          try {
            await fs.unlink(file.path);
          } catch (error) {
            console.error(`ไม่สามารถลบไฟล์ ${file.path}:`, error);
          }
        }
      }
    }

    if(!isValidId(id)) {
      removeUploadImages();
      return next(new AppError('Product id must not zero or negative number', 400));
    }

    if(!isValidHaveValue([userId])) {
      removeUploadImages();
      return next(new AppError('userId is required', 400));
    }

    const data : updateProductDto = {
      name: name,
      description: description,
      brandId: Number(brandId),
      price: Number(price),
      categories: categoriesData,
      specs: {
        screen_size: screen_size,
        processor: processor,
        display: display,
        memory: memory,
        storage: storage,
        graphic: graphic,
        operating_system: operating_system,
        camera: camera,
        optical_drive: optical_drive,
        connection_ports: connection_ports,
        wireless: wireless,
        battery: battery,
        color: color,
        dimension: dimension,
        weight: weight,
        warranty: warranty,
        option: option
      }
    }

    if(isValidHaveValue([tagsData])) {
      data.tags = tagsData;
    }
    if(isValidHaveValue([imagesUpdateData])) {
      data.imagesUpdate = imagesUpdateData;
    }

    const updateProduct = await productService.update(
      Number(id),
      Number(userId), 
      data, 
      Array.isArray(req.files) ? req.files : []
    );

    res.status(200).json({
      status: 'Updating product ok',
      RESULT_DATA: { updateProduct }
    });
  });

  async moveProductToTrash(req: Request, res: Response) {
    const { productsId, userId } = req.body;

    for(let id of productsId) {
      if(!isValidId(id)) {
        sendError(res, 400, `Product id must not zero or negative number`);
      }
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const deleteProducts = await productService.softDelete(productsId, userId);
      sendResponse(res, 200, `Deleting products ok`, deleteProducts)
    }
    catch (error: any) {
      console.error('Deleting products error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getStatisticProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '8');
    const orderBy = req.query.orderBy as string || 'createdAt';
    const orderDir = req.query.orderDir as string || 'desc';
    const search = req.query.search as string;
    const inStock = req.query.inStock as string;
    const sale = req.query.sale as string;
    const totalSale = req.query.totalSale as string;
    
    try {
      const products = await productService.statisticProducts(page, pageSize, orderBy, orderDir, search, inStock, sale, totalSale);
      sendResponse(res, 200, `Get all product statistic ok`, products.data, products.meta);
    }
    catch (error: any) {
      console.error('Get all product statistic error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getProductsInTrash(req: Request, res: Response) {
    // pagination
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '8');
    // sorting
    const orderBy = req.query.orderBy as string || 'createdAt';
    const orderDir = req.query.orderDir as string || 'desc';

    try {
      const products = await productService.findAllInTrash(page, pageSize, orderBy, orderDir);
      sendResponse(res, 200, `Get all product in trash ok`, products.data, products.meta);
    }
    catch (error: any) {
      console.error('Get all product in trash error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }
}
