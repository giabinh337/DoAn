import { PrismaService } from '../prisma/prisma.service';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(body: any): Promise<{
        message: string;
        order: {
            passengers: {
                id: number;
                fullName: string;
                specialRequests: string | null;
                orderId: number;
            }[];
        } & {
            id: number;
            status: string;
            userId: string;
            totalPrice: number;
            orderCode: string;
            scheduleId: number;
            promotionId: number | null;
        };
    }>;
    getOrdersByUser(userId: string): Promise<({
        passengers: {
            id: number;
            fullName: string;
            specialRequests: string | null;
            orderId: number;
        }[];
        schedule: {
            tour: {
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
            };
        } & {
            id: number;
            tourId: number;
            startDate: Date;
            totalSeats: number;
            availableSeats: number;
        };
    } & {
        id: number;
        status: string;
        userId: string;
        totalPrice: number;
        orderCode: string;
        scheduleId: number;
        promotionId: number | null;
    })[]>;
    getAllOrders(): Promise<({
        user: {
            id: string;
            email: string;
            passwordHash: string;
            role: string;
            status: string;
        };
        passengers: {
            id: number;
            fullName: string;
            specialRequests: string | null;
            orderId: number;
        }[];
        schedule: {
            tour: {
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
            };
        } & {
            id: number;
            tourId: number;
            startDate: Date;
            totalSeats: number;
            availableSeats: number;
        };
    } & {
        id: number;
        status: string;
        userId: string;
        totalPrice: number;
        orderCode: string;
        scheduleId: number;
        promotionId: number | null;
    })[]>;
    updateOrderStatus(orderId: number, status: string): Promise<{
        id: number;
        status: string;
        userId: string;
        totalPrice: number;
        orderCode: string;
        scheduleId: number;
        promotionId: number | null;
    }>;
}
