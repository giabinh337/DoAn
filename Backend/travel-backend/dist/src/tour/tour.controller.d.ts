import { TourService } from './tour.service';
import { CreateTourDto, UpdateTourDto, CreateDestinationDto } from './dto/tour.dto';
export declare class TourController {
    private readonly tourService;
    constructor(tourService: TourService);
    seedData(): Promise<{
        message: string;
    }>;
    getCategories(): Promise<{
        id: number;
        name: string;
        vibeIcon: string;
    }[]>;
    getDestinations(): Promise<{
        id: number;
        name: string;
        region: string;
    }[]>;
    createDestination(body: CreateDestinationDto): Promise<{
        id: number;
        name: string;
        region: string;
    }>;
    getAllTours(): Promise<({
        category: {
            id: number;
            name: string;
            vibeIcon: string;
        };
        destination: {
            id: number;
            name: string;
            region: string;
        };
    } & {
        id: number;
        name: string;
        image: string;
        gallery: import("@prisma/client/runtime/library").JsonValue | null;
        price: number;
        overview: string | null;
        highlights: import("@prisma/client/runtime/library").JsonValue | null;
        itinerary: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        destinationId: number;
    })[]>;
    getTourById(id: number): Promise<{
        category: {
            id: number;
            name: string;
            vibeIcon: string;
        };
        destination: {
            id: number;
            name: string;
            region: string;
        };
    } & {
        id: number;
        name: string;
        image: string;
        gallery: import("@prisma/client/runtime/library").JsonValue | null;
        price: number;
        overview: string | null;
        highlights: import("@prisma/client/runtime/library").JsonValue | null;
        itinerary: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        destinationId: number;
    }>;
    createTour(body: CreateTourDto): Promise<{
        id: number;
        name: string;
        image: string;
        gallery: import("@prisma/client/runtime/library").JsonValue | null;
        price: number;
        overview: string | null;
        highlights: import("@prisma/client/runtime/library").JsonValue | null;
        itinerary: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        destinationId: number;
    }>;
    updateTour(id: number, body: UpdateTourDto): Promise<{
        id: number;
        name: string;
        image: string;
        gallery: import("@prisma/client/runtime/library").JsonValue | null;
        price: number;
        overview: string | null;
        highlights: import("@prisma/client/runtime/library").JsonValue | null;
        itinerary: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        destinationId: number;
    }>;
    deleteTour(id: number): Promise<{
        id: number;
        name: string;
        image: string;
        gallery: import("@prisma/client/runtime/library").JsonValue | null;
        price: number;
        overview: string | null;
        highlights: import("@prisma/client/runtime/library").JsonValue | null;
        itinerary: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        destinationId: number;
    }>;
}
