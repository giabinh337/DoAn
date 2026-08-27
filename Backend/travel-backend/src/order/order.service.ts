import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(body: any) {
    const { userId, tourId, passengers, totalPrice } = body;

    if (!userId || !tourId || !passengers || passengers.length === 0) {
      throw new BadRequestException('Vui lòng cung cấp đủ userId, tourId và danh sách passengers!');
    }

    // 1. Tìm hoặc tạo nhanh 1 lịch khởi hành (TourSchedule) cho Tour này
    // Cách này giúp lách qua việc bắt buộc phải tạo Schedule thủ công từ trước
    let schedule = await this.prisma.tourSchedule.findFirst({
      where: { tourId: Number(tourId) }
    });

    if (!schedule) {
      schedule = await this.prisma.tourSchedule.create({
        data: {
          tourId: Number(tourId),
          startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Khởi hành sau 7 ngày
          totalSeats: 20,
          availableSeats: 20,
        }
      });
    }

    // Kiểm tra xem có đủ chỗ không
    if (schedule.availableSeats < passengers.length) {
      throw new BadRequestException('Lịch trình này không còn đủ chỗ trống!');
    }

    // 2. Tạo Đơn hàng (Order) và Danh sách Hành khách (Passenger)
    const order = await this.prisma.order.create({
      data: {
        orderCode: 'ORD' + Date.now(),
        userId: userId,
        scheduleId: schedule.id,
        totalPrice: Number(totalPrice),
        status: 'PENDING', // Trạng thái chờ thanh toán
        passengers: {
          create: passengers.map((p: any) => ({
            fullName: p.name,
            specialRequests: p.specialRequests || ''
          }))
        }
      },
      include: {
        passengers: true // Trả về luôn thông tin hành khách vừa tạo
      }
    });

    // 3. Cập nhật lại số ghế trống
    await this.prisma.tourSchedule.update({
      where: { id: schedule.id },
      data: { availableSeats: schedule.availableSeats - passengers.length }
    });

    return {
      message: 'Đặt tour thành công!',
      order
    };
  }

  async getOrdersByUser(userId: string) {
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
        user: true, // Lấy thông tin người đặt
        passengers: true
      },
      orderBy: { id: 'desc' }
    });
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }
}
