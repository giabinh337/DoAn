import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(body: any): Promise<{
        id: number;
        userId: string;
        tourId: number;
        rating: number;
        comment: string;
    }>;
    getReviewsByTour(tourId: string): Promise<({
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
