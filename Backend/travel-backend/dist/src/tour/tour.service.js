"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TourService = class TourService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllTours() {
        return this.prisma.tour.findMany({
            include: {
                category: true,
                destination: true,
            }
        });
    }
    async getTourById(id) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
            include: { category: true, destination: true }
        });
        if (!tour)
            throw new common_1.NotFoundException('Không tìm thấy Tour này trong hệ thống!');
        return tour;
    }
    async createTour(data) {
        return this.prisma.tour.create({
            data: {
                categoryId: data.categoryId,
                destinationId: data.destinationId,
                name: data.name,
                image: data.image,
                gallery: data.gallery,
                overview: data.overview,
                highlights: data.highlights,
                price: data.price,
                itinerary: data.itinerary,
            }
        });
    }
    async getCategories() {
        return this.prisma.category.findMany();
    }
    async getDestinations() {
        return this.prisma.destination.findMany();
    }
    async createDestination(data) {
        return this.prisma.destination.create({ data });
    }
    async updateTour(id, data) {
        await this.getTourById(id);
        return this.prisma.tour.update({
            where: { id },
            data: { ...data }
        });
    }
    async deleteTour(id) {
        await this.getTourById(id);
        return this.prisma.tour.delete({
            where: { id }
        });
    }
    async seedData() {
        await this.prisma.category.createMany({
            data: [
                { id: 1, name: 'Nghỉ dưỡng', vibeIcon: 'Palmtree' },
                { id: 2, name: 'Mạo hiểm', vibeIcon: 'Mountain' }
            ],
            skipDuplicates: true
        });
        await this.prisma.destination.createMany({
            data: [
                { id: 1, name: 'Phú Quốc', region: 'Miền Nam' },
                { id: 2, name: 'Sapa', region: 'Miền Bắc' }
            ],
            skipDuplicates: true
        });
        return { message: 'Đã tạo xong dữ liệu Danh mục và Điểm đến mẫu! Bạn đã có thể tạo Tour.' };
    }
};
exports.TourService = TourService;
exports.TourService = TourService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TourService);
//# sourceMappingURL=tour.service.js.map