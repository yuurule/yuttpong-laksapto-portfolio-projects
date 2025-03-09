import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { TagService } from '../services/tag.service';

const tagService = new TagService();

export class TagController {

  async getAllTag(req: Request, res: Response) {
    try {
      const tags = await tagService.findAll();
      sendResponse(res, 200, `Get all tag ok`, tags)
    }
    catch (error: any) {
      console.error('Get all tag error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneTagById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Tag id must not zero or negative number`);
    }

    try {
      const tag = await tagService.findOne(id);
      sendResponse(res, 200, `Get tag by id ok`, tag);
    }
    catch (error: any) {
      console.error('Get tag by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createNewTag(req: Request, res: Response) {
    const { name, userId } = req.body;

    if(!isValidHaveValue([name, userId])) {
      sendError(res, 400, `name and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const newTag = await tagService.create(name, userId);
      sendResponse(res, 201, `Creating tag ok`, newTag);
    }
    catch (error: any) {
      console.error('Creating tag error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateTag(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { name, userId } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Tag id must not zero or negative number`);
    }

    if(!isValidHaveValue([name, userId])) {
      sendError(res, 400, `name and userId is required`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const updateTag = await tagService.update(id, name, userId);
      sendResponse(res, 200, `Updating tag ok`, updateTag)
    }
    catch (error: any) {
      console.error('Updating tag error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async deleteTags(req: Request, res: Response) {
    const { tagsId, userId } = req.body;

    if(!isValidHaveValue([tagsId, userId])) {
      sendError(res, 400, `tagsId and userId is required`);
    }

    for(let i = 0; i < tagsId.length; i++) {
      if(!isValidId(tagsId[i])) {
        sendError(res, 400, `Tag id must not zero or negative number`);
      }
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const deleteTags = await tagService.delete(tagsId, userId);
      sendResponse(res, 200, `Deleting tags ok`, deleteTags)
    }
    catch (error: any) {
      console.error('Deleting tags error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}