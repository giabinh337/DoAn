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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderService = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(body) {
        const { userId, tourId, passengers, totalPrice } = body;
        if (!userId || !tourId || !passengers || passengers.length === 0) {
            throw new common_1.BadRequestException('Vui lòng cung cấp đủ userId, tourId và danh sách passengers!');
        }
        let schedule = await this.prisma.tourSchedule.findFirst({
            where: { tourId: Number(tourId) }
        });
        if (!schedule) {
            schedule = await this.prisma.tourSchedule.create({
                data: {
                    tourId: Number(tourId),
                    startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                    totalSeats: 20,
                    availableSeats: 20,
                }
            });
        }
        if (schedule.availableSeats < passengers.length) {
            throw new common_1.BadRequestException('Lịch trình này không còn đủ chỗ trống!');
        }
        const order = await this.prisma.order.create({
            data: {
                orderCode: 'ORD' + Date.now(),
                userId: userId,
                scheduleId: schedule.id,
                totalPrice: Number(totalPrice),
                status: 'PENDING',
                passengers: {
                    create: passengers.map((p) => ({
                        fullName: p.name,
                        specialRequests: p.specialRequests || ''
                    }))
                }
            },
            include: {
                passengers: true
            }
        });
        await this.prisma.tourSchedule.update({
            where: { id: schedule.id },
            data: { availableSeats: schedule.availableSeats - passengers.length }
        });
        return {
            message: 'Đặt tour thành công!',
            order
        };
    }
    async getOrdersByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                schedule: {
                    include: {
                        tour: {
                            include: { destination: true, category: true }
                        }
                    }
                },
                passengers: true
            },
            orderBy: { id: 'desc' }
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                schedule: {
                    include: {
                        tour: {
                            include: { destination: true, category: true }
                        }
                    }
                },
                user: true,
                passengers: true
            },
            orderBy: { id: 'desc' }
        });
    }
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map