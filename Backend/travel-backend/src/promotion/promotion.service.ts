import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  async createPromotion(data: CreatePromotionDto) {
    const existing = await this.prisma.promotion.findUnique({
      where: { code: data.code }
    });

    if (existing) {
      throw new BadRequestException('Mã khuyến mãi đã tồn tại');
    }

    return this.prisma.promotion.create({
      data: {
        code: data.code.toUpperCase(),
        discountValue: data.discountValue
      }
    });
  }

  async getAllPromotions() {
    return this.prisma.promotion.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async deletePromotion(id: number) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Không tìm thấy mã khuyến mãi');
    }
    return this.prisma.promotion.delete({
      where: { id }
    });
  }

  async validatePromotion(code: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promotion) {
      throw new NotFoundException('Mã khuyến mãi không hợp lệ hoặc không tồn tại');
    }

    return promotion;
  }
}
