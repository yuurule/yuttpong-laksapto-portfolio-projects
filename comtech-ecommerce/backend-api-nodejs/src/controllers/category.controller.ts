import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { CategoryService } from '../services/category.service';
import { createCategoryDto } from '../types';

const categoryService = new CategoryService();

export class CategoryController {

  async getAllCategory(req: Request, res: Response) {
    try {
      const categories = await categoryService.findAll();
      sendResponse(res, 200, `Get all category ok`, categories)
    }
    catch (error: any) {
      console.error('Get all category error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneCategoryById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Category id must not zero or negative number`);
    }

    try {
      const category = await categoryService.findOne(id);
      sendResponse(res, 200, `Get category by id ok`, category);
    }
    catch (error: any) {
      console.error('Get category by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createNewCategory(req: Request, res: Response) {
    const { name, description, userId } = req.body;

    if(!isValidHaveValue([name, description, userId])) {
      sendError(res, 400, `name, description and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const data : createCategoryDto = {
      name: name,
      description: description
    } 

    try {
      const newCategory = await categoryService.create(data, userId);
      sendResponse(res, 201, `Creating category ok`, newCategory);
    }
    catch (error: any) {
      console.error('Creating category error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { name, description, userId } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Category id must not zero or negative number`);
    }

    if(!isValidHaveValue([name, description, userId])) {
      sendError(res, 400, `name, description and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const data : createCategoryDto = {
      name: name,
      description: description
    } 

    try {
      const updateCategory = await categoryService.update(id, data, userId);
      sendResponse(res, 200, `Updating category ok`, updateCategory)
    }
    catch (error: any) {
      console.error('Updating category error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async deleteCategories(req: Request, res: Response) {
    const { categoriesId, userId } = req.body;

    for(let i = 0; i < categoriesId.length; i++) {
      if(!isValidId(categoriesId[i])) {
        sendError(res, 400, `Category id must not zero or negative number`);
      }
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const deleteCategories = await categoryService.delete(categoriesId, userId);
      sendResponse(res, 200, `Deleting categories ok`, deleteCategories)
    }
    catch (error: any) {
      console.error('Deleting categories error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}