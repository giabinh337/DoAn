import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto, UpdateTourDto, CreateDestinationDto } from './dto/tour.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tour (Quản lý Tour)')
@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // Đường dẫn: POST http://localhost:3000/tour/seed
  @Post('seed')
  @ApiOperation({ summary: 'Tạo dữ liệu Danh mục & Điểm đến MẪU (Nên bấm cái này đầu tiên)' })
  seedData() {
    return this.tourService.seedData();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách Danh mục' })
  getCategories() {
    return this.tourService.getCategories();
  }

  @Get('destinations')
  @ApiOperation({ summary: 'Lấy danh sách Điểm đến' })
  getDestinations() {
    return this.tourService.getDestinations();
  }

  @Post('destinations')
  @ApiOperation({ summary: 'Thêm Điểm đến mới' })
  createDestination(@Body() body: CreateDestinationDto) {
    return this.tourService.createDestination(body);
  }

  // Đường dẫn: GET http://localhost:3000/tour
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách Tour' })
  getAllTours() {
    return this.tourService.getAllTours();
  }

  // Đường dẫn: GET http://localhost:3000/tour/1
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 Tour (theo ID)' })
  getTourById(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.getTourById(id);
  }

  // Đường dẫn: POST http://localhost:3000/tour
  @Post()
  @ApiOperation({ summary: 'Thêm mới 1 Tour' })
  createTour(@Body() body: CreateTourDto) {
    return this.tourService.createTour(body);
  }

  // Đường dẫn: PUT http://localhost:3000/tour/1
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật/Sửa thông tin Tour' })
  updateTour(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateTourDto
  ) {
    return this.tourService.updateTour(id, body);
  }

  // Đường dẫn: DELETE http://localhost:3000/tour/1
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa Tour' })
  deleteTour(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.deleteTour(id);
  }
}
