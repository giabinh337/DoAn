import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto, UpdateTourDto } from './dto/tour.dto';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy toàn bộ danh sách Tour (Read All)
  async getAllTours(keyword?: string) {
    const whereCondition = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { destination: { name: { contains: keyword } } },
          ],
        }
      : {};

    return this.prisma.tour.findMany({
      where: whereCondition,
      include: {
        category: true, // Lấy luôn thông tin Category đi kèm
        destination: true, // Lấy luôn thông tin Destination đi kèm
      }
    });
  }

  // 2. Lấy thông tin 1 Tour theo ID (Read One)
  async getTourById(id: number) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: { category: true, destination: true }
    });
    if (!tour) throw new NotFoundException('Không tìm thấy Tour này trong hệ thống!');
    return tour;
  }

  // 3. Thêm Tour mới (Create)
  async createTour(data: CreateTourDto) {
    return this.prisma.tour.create({
      data: {
        categoryId: data.categoryId,
        destinationId: data.destinationId,
        name: data.name,
        image: data.image, // Lưu link ảnh (nếu có, không thì prisma sẽ tự lấy default)
        gallery: data.gallery,
        overview: data.overview,
        highlights: data.highlights,
        price: data.price,
        // Ép kiểu itinerary sang chuỗi JSON nếu nó là object để prisma không lỗi, 
        // nhưng Prisma dùng MySQL 5.7+ JSON type thì truyền object là được.
        itinerary: data.itinerary, 
      }
    });
  }

  // 3.1. Lấy Categories và Destinations
  async getCategories() {
    return this.prisma.category.findMany();
  }

  async getDestinations() {
    return this.prisma.destination.findMany();
  }

  async createDestination(data: { name: string, region: string }) {
    return this.prisma.destination.create({ data });
  }

  // 4. Sửa thông tin Tour (Update)
  async updateTour(id: number, data: UpdateTourDto) {
    // Bước 1: Kiểm tra xem tour có tồn tại không đã
    await this.getTourById(id); 
    
    // Bước 2: Cập nhật dữ liệu
    return this.prisma.tour.update({
      where: { id },
      data: { ...data }
    });
  }

  // 5. Xóa Tour (Delete)
  async deleteTour(id: number) {
    // Bước 1: Kiểm tra xem tour có tồn tại không
    await this.getTourById(id);
    
    // Bước 2: Xóa
    return this.prisma.tour.delete({
      where: { id }
    });
  }

  // ==========================================
  // HÀM ĐẶC BIỆT: Khởi tạo dữ liệu mẫu (Seeding)
  // Vì phải có Danh mục & Điểm đến thì mới tạo được Tour
  // ==========================================
  async seedData() {
    // Thêm 2 Danh mục cơ bản
    await this.prisma.category.createMany({
      data: [
        { id: 1, name: 'Nghỉ dưỡng', vibeIcon: 'Palmtree' },
        { id: 2, name: 'Mạo hiểm', vibeIcon: 'Mountain' }
      ],
      skipDuplicates: true // Nếu đã có rồi thì bỏ qua không lỗi
    });

    // Thêm 2 Điểm đến cơ bản
    await this.prisma.destination.createMany({
      data: [
        { id: 1, name: 'Phú Quốc', region: 'Miền Nam' },
        { id: 2, name: 'Sapa', region: 'Miền Bắc' }
      ],
      skipDuplicates: true
    });

    return { message: 'Đã tạo xong dữ liệu Danh mục và Điểm đến mẫu! Bạn đã có thể tạo Tour.' };
  }
}
