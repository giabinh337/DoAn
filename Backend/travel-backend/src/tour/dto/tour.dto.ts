import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTourDto {
  @ApiProperty({ example: 1, description: 'ID của Danh mục (VD: 1 - Nghỉ dưỡng)' })
  categoryId: number;

  @ApiProperty({ example: 1, description: 'ID của Điểm đến (VD: 1 - Phú Quốc)' })
  destinationId: number;

  @ApiProperty({ example: 'Tour Khám Phá Phú Quốc 3N2Đ', description: 'Tên của Tour' })
  name: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...', description: 'Link ảnh đại diện Tour', required: false })
  image?: string;

  @ApiProperty({ example: ['/images/uploads/1.jpg', '/images/uploads/2.jpg'], description: 'Danh sách ảnh', required: false })
  gallery?: any;

  @ApiProperty({ example: 5500000, description: 'Giá của Tour (VND)' })
  price: number;

  @ApiProperty({ example: 'Khám phá văn hóa Tây Bắc...', description: 'Tổng quan chuyến đi', required: false })
  overview?: string;

  @ApiProperty({ example: '["Trải nghiệm văn hóa", "Cảnh quan đẹp"]', description: 'Điểm nổi bật', required: false })
  highlights?: any;

  @ApiProperty({ 
    example: [ { "day": 1, "activity": "Đón sân bay" }, { "day": 2, "activity": "Lặn ngắm san hô" } ], 
    description: 'Lịch trình chi tiết (Lưu dạng JSON)' 
  })
  itinerary: any;
}

// PartialType giúp UpdateTourDto sao chép toàn bộ thuộc tính của CreateTourDto nhưng biến chúng thành "không bắt buộc"
export class UpdateTourDto extends PartialType(CreateTourDto) {}

export class CreateDestinationDto {
  @ApiProperty({ example: 'Côn Đảo' })
  name: string;

  @ApiProperty({ example: 'Miền Nam' })
  region: string;
}
