import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { BrandService } from '../services/brand.service';

const brandService = new BrandService();

export class BrandController {

  async getAllBrand(req: Request, res: Response) {
    try {
      const brands = await brandService.findAll();
      sendResponse(res, 200, `Get all brand ok`, brands)
    }
    catch (error: any) {
      console.error('Get all brand error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneBrandById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Brand id must not zero or negative number`);
    }

    try {
      const brand = await brandService.findOne(id);
      sendResponse(res, 200, `Get brand by id ok`, brand);
    }
    catch (error: any) {
      console.error('Get brand by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createNewBrand(req: Request, res: Response) {
    const { name, userId } = req.body;

    if(!isValidHaveValue([name, userId])) {
      sendError(res, 400, `name and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const newBrand = await brandService.create(name, userId);
      sendResponse(res, 201, `Creating brand ok`, newBrand);
    }
    catch (error: any) {
      console.error('Creating brand error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateBrand(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { name, userId } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Brand id must not zero or negative number`);
    }

    if(!isValidHaveValue([name, userId])) {
      sendError(res, 400, `name and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const updateBrand = await brandService.update(id, name, userId);
      sendResponse(res, 200, `Updating brand ok`, updateBrand)
    }
    catch (error: any) {
      console.error('Updating brand error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async deleteBrands(req: Request, res: Response) {
    const { brandsId, userId } = req.body;

    if(!isValidHaveValue([brandsId, userId])) {
      sendError(res, 400, `brandsId and userId is required`);
    }

    for(let i = 0; i < brandsId.length; i++) {
      if(!isValidId(brandsId[i])) {
        sendError(res, 400, `Brand id must not zero or negative number`);
      }
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const deleteBrands = await brandService.delete(brandsId, userId);
      sendResponse(res, 200, `Deleting brands ok`, deleteBrands)
    }
    catch (error: any) {
      console.error('Deleting brands error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}