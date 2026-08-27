import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // HÀM ĐĂNG KÝ
  async register(body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Vui lòng nhập đầy đủ email và mật khẩu!');
    }

    // 1. Kiểm tra xem email đã tồn tại trong CSDL chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Mã hóa (băm) mật khẩu để bảo mật
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Tạo dữ liệu User mới và lưu xuống CSDL
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash, // Lưu mật khẩu đã mã hóa, tuyệt đối không lưu mật khẩu gốc
      },
    });

    return {
      message: 'Đăng ký thành công!',
      userId: newUser.id,
      email: newUser.email,
    };
  }

  // HÀM ĐĂNG NHẬP
  async login(body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Vui lòng nhập đầy đủ email và mật khẩu!');
    }

    // 1. Tìm User dựa trên email người dùng nhập
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại!');
    }

    // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong CSDL
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Sai mật khẩu!');
    }

    // 3. Nếu đúng mật khẩu, tạo một cái thẻ (Token JWT) để người dùng xài sau này
    const payload = { userId: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công!',
      access_token: access_token,
      role: user.role
    };
  }
}
