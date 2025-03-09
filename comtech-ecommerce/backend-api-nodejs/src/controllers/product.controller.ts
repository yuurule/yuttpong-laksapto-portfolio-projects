import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { ProductService } from '../services/product.service';
import { createProductDto, updateProductDto } from '../types';

const productService = new ProductService();

export class ProductController {

  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.findAll();
      sendResponse(res, 200, `Get all product ok`, products);
    }
    catch (error: any) {
      console.error('Get all product error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(isValidId(id)) {
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

  async createNewProduct(req: Request, res: Response) {
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
      dimemsion,
      weight,
      warranty,
      option,
    } = specs;

    if(!isValidHaveValue([userId, name, description, brandId, price, publish, categories, specs])) {
      sendError(res, 400, `userId, name, description brandId, price, publish, categories and specs is required`);
    }
    if(!isValidHaveValue([screen_size, processor, display, memory, storage, graphic, operating_system, camera, optical_drive, connection_ports, wireless, battery, color, dimemsion, weight, warranty, option])) {
      sendError(res, 400, `Some data in specs is missing`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    if(!isValidId(brandId)) {
      sendError(res, 400, `Brand id must not zero or negative number`);
    }

    const data : createProductDto = {
      name: name,
      description: description,
      brandId: brandId,
      price: price,
      publish: publish,
      categories: categories,
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
        dimemsion: dimemsion,
        weight: weight,
        warranty: warranty,
        option: option
      }
    }

    if(isValidHaveValue([tags])) {
      data.tags = tags;
    }
    if(isValidHaveValue([images])) {
      data.images = images;
    }

    try {
      const newProduct = await productService.create(data, userId);
      sendResponse(res, 201, `Creating product ok`, newProduct)
    }
    catch (error: any) {
      console.error('Creating product error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
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
      dimemsion,
      weight,
      warranty,
      option,
    } = specs;

    if(!isValidId(id)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }

    if(!isValidHaveValue([userId])) {
      sendError(res, 400, `userId is required`);
    }

    const data : updateProductDto = {
      name: name,
      description: description,
      brandId: brandId,
      price: price,
      publish: publish,
      categories: categories,
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
        dimemsion: dimemsion,
        weight: weight,
        warranty: warranty,
        option: option
      }
    }

    if(isValidHaveValue([tags])) {
      data.tags = tags;
    }
    if(isValidHaveValue([images])) {
      data.images = images;
    }

    try {
      const updateProduct = await productService.updateOne(id, data, userId);
      sendResponse(res, 200, `Updating product ok`, updateProduct)
    }
    catch (error: any) {
      console.error('Updating product error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

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

}
