import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(body: any) {
    const { userId, tourId, rating, comment } = body;
    if (!userId || !tourId || !rating) {
      throw new BadRequestException('Missing required fields');
    }

    return this.prisma.review.create({
      data: {
        userId,
        tourId: Number(tourId),
        rating: Number(rating),
        comment: comment || ''
      }
    });
  }

  async getReviewsByTour(tourId: number) {
    return this.prisma.review.findMany({
      where: { tourId },
      include: {
        user: {
          select: { id: true, email: true }
        }
      },
      orderBy: { id: 'desc' }
    });
  }
}
