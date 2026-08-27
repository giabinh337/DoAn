import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() body: any) {
    return this.reviewService.createReview(body);
  }

  @Get('tour/:tourId')
  async getReviewsByTour(@Param('tourId') tourId: string) {
    return this.reviewService.getReviewsByTour(Number(tourId));
  }
}
