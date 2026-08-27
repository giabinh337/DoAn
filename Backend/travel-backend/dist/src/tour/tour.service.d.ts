import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto, UpdateTourDto } from './dto/tour.dto';
export declare class TourService {
    private prisma;
    constructor(prisma: PrismaService);
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
    createTour(data: CreateTourDto): Promise<{
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
    createDestination(data: {
        name: string;
        region: string;
    }): Promise<{
        id: number;
        name: string;
        region: string;
    }>;
    updateTour(id: number, data: UpdateTourDto): Promise<{
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
    seedData(): Promise<{
        message: string;
    }>;
}
