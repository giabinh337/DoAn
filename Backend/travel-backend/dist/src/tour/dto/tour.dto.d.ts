export declare class CreateTourDto {
    categoryId: number;
    destinationId: number;
    name: string;
    image?: string;
    gallery?: any;
    price: number;
    overview?: string;
    highlights?: any;
    itinerary: any;
}
declare const UpdateTourDto_base: import("@nestjs/common").Type<Partial<CreateTourDto>>;
export declare class UpdateTourDto extends UpdateTourDto_base {
}
export declare class CreateDestinationDto {
    name: string;
    region: string;
}
export {};
