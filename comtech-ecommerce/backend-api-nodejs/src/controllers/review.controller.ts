import { Request, Response, NextFunction } from 'express';
import { sendResponse, sendError } from '../libs/response';
import { isValidId, isValidHaveValue } from '../libs/validation';
import { ReviewService } from '../services/review.service';
import { createReviewDto } from '../types';
import { parseBoolean } from '../libs/utility';

const reviewService = new ReviewService();

export class ReviewController {

  async getReviews(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '8');
    const pagination = parseBoolean(req.query.noPagination as string) || true;
    const orderBy = req.query.orderBy as string || 'createdAt';
    const orderDir = req.query.orderDir as string || 'desc';

    try {
      const reviews = await reviewService.findAll(page, pageSize, pagination, orderBy, orderDir);
      sendResponse(res, 200, `Get all review ok`, reviews)
    }
    catch (error: any) {
      console.error('Get all review error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async getOneReview(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if(!isValidId(id)) {
      sendError(res, 400, `Review id must not zero or negative number`);
    }

    try {
      const review = await reviewService.findOne(id);
      sendResponse(res, 200, `Get review by id ok`, review);
    }
    catch (error: any) {
      console.error('Get review by id error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async createReview(req: Request, res: Response) {
    const { productId, message, rating, customerId } = req.body;

    if(!isValidHaveValue([productId, message, rating, customerId])) {
      sendError(res, 400, `productId, message, rating and customerId is required`);
    }

    if(!isValidId(productId)) {
      sendError(res, 400, `Product id must not zero or negative number`);
    }
    if(!isValidId(customerId)) {
      sendError(res, 400, `Customer id must not zero or negative number`);
    }

    const data : createReviewDto = {
      productId: productId,
      message: message,
      rating: rating,
    } 

    try {
      const newReview = await reviewService.create(data, customerId);
      sendResponse(res, 201, `Creating review ok`, newReview);
    }
    catch (error: any) {
      console.error('Creating review error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async updateReview(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { message, rating } = req.body;

    if(!isValidHaveValue([message]) && !isValidHaveValue([rating])) {
      sendError(res, 400, `Require less one message or rating`);
    }

    if(!isValidId(id)) {
      sendError(res, 400, `Review id must not zero or negative number`);
    }

    try {
      const updateReview = await reviewService.update(id, { message, rating });
      sendResponse(res, 200, `Updating review ok`, updateReview)
    }
    catch (error: any) {
      console.error('Updating review error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async approveReview(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { approve } = req.body;

    if(!isValidId(id)) {
      sendError(res, 400, `Review id must not zero or negative number`);
    }

    try {
      const approveReview = await reviewService.approve(id, approve);
      sendResponse(res, 200, `Approving review ok`, approveReview)
    }
    catch (error: any) {
      console.error('Approving review error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

  async deleteReview(req: Request, res: Response) {
    const { reviewId } = req.body;

    if(!isValidHaveValue([reviewId])) {
      sendError(res, 400, `reviewId is required`);
    }

    if(!isValidId(reviewId)) {
      sendError(res, 400, `reviewId must not zero or negative number`);
    }

    try {
      const deleteReview = await reviewService.delete(reviewId);
      sendResponse(res, 200, `Deleting review ok`, deleteReview)
    }
    catch (error: any) {
      console.error('Deleting review error: ', error);
      sendError(res, error.statusCode, error.message);
    }
  }

}