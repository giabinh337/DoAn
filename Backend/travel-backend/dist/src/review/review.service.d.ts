import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(body: any): Promise<{
        id: number;
        userId: string;
        tourId: number;
        rating: number;
        comment: string;
    }>;
    getReviewsByTour(tourId: number): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: number;
        userId: string;
        tourId: number;
        rating: number;
        comment: string;
    })[]>;
}
