import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { CampaignService } from '../services/campaign.service';
import { createCampaignDto, createCampaignHistoryDto, updateProductDto } from '../types';
import { updateCampaignDto } from '../types';

const campaignService = new CampaignService();

export class CampaignController {

  async getCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await campaignService.findAll();
      sendResponse(res, 200, `Get all campaign ok`, campaigns)
    }
    catch (error: any) {
      console.error('Get all campaign error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneCampaignById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Campaign id must not zero or negative number`);
    } 

    try {
      const campaign = await campaignService.findOne(id);
      sendResponse(res, 200, `Get one campaign by id ok`, campaign)
    }
    catch (error: any) {
      console.error('Get one campaign by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createCampaign(req: Request, res: Response) {
    const { userId, name, description, discount } = req.body;
    
    if(!isValidHaveValue([userId, name, description, discount])) {
      sendError(res, 400, `userId, name, description and discount is required`);
    }

    if(!isValidId(discount)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const dataDto : createCampaignDto = {
      userId: userId,
      name: name,
      description: description,
      discount: discount
    }

    try {
      const newCampaign = await campaignService.create(dataDto);
      sendResponse(res, 201, `Creating campaign ok`, newCampaign)
    }
    catch (error: any) {
      console.error('Creating campaign error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateCampaign(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { userId, name, description, discount } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Campaign id must not zero or negative number`);
    } 

    if(!isValidHaveValue([userId])) {
      sendError(res, 400, `userId is required`);
    }

    if(isValidHaveValue([discount]) && !isValidId(discount)) {
      sendError(res, 400, `discount must not zero or negative number`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const data : updateCampaignDto = {
      userId: userId,
      name: name,
      description: description,
      discount: discount
    } 

    try {
      const updateCampaign = await campaignService.update(id, data);
      sendResponse(res, 200, `Updating campaign ok`, updateCampaign)
    }
    catch (error: any) {
      console.error('Updating campaign error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async moveCampaignsToTrash(req: Request, res: Response) {
    const { campaignsId, userId } = req.body;
    
    if(!isValidHaveValue([campaignsId, userId])) {
      sendError(res, 400, `campaignsId and userId is required`);
    }

    for(const id of campaignsId) {
      if(!isValidId(id)) {
        sendError(res, 400, `Campaign id must not zero or negative number`);
      }
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    try {
      const softDeleteCampaigns = await campaignService.moveToTrash(campaignsId, userId);
      sendResponse(res, 200, `Soft delete campaigns ok`, softDeleteCampaigns)
    }
    catch (error: any) {
      console.error('Soft delete campaigns error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createCampaignHistory(req: Request, res: Response) {
    const { userId, campaignId, action, note } = req.body;

    if(!isValidHaveValue([userId, campaignId, action])) {
      sendError(res, 400, `userId, campaignId and action is required`);
    }

    if(!isValidId(campaignId)) {
      sendError(res, 400, `Campaign id must not zero or negative number`);
    }

    if(!isValidId(userId)) {
      sendError(res, 400, `User id must not zero or negative number`);
    }

    const dataDto : createCampaignHistoryDto = {
      campaignId: campaignId,
      userId: userId,
      action: action
    }

    if(isValidHaveValue([note])) {
      dataDto.note = note;
    }

    try {
      const newCampaignHistory = await campaignService.createHistory(dataDto);
      sendResponse(res, 201, `Creating campaign history ok`, null)
    }
    catch (error: any) {
      console.error('Creating campaign history error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}