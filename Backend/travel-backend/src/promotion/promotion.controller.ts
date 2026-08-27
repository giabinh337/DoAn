import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/promotion.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Promotion (Quản lý khuyến mãi)')
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm mới mã khuyến mãi' })
  createPromotion(@Body() body: CreatePromotionDto) {
    return this.promotionService.createPromotion(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách mã khuyến mãi' })
  getAllPromotions() {
    return this.promotionService.getAllPromotions();
  }

  @Get('validate')
  @ApiOperation({ summary: 'Kiểm tra mã khuyến mãi hợp lệ' })
  @ApiQuery({ name: 'code', required: true })
  validatePromotion(@Query('code') code: string) {
    return this.promotionService.validatePromotion(code);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mã khuyến mãi' })
  deletePromotion(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.deletePromotion(id);
  }
}
