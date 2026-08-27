import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Cài đặt thư viện tạo Token (JWT)
    JwtModule.register({
      global: true, // Dùng chung cho toàn hệ thống
      secret: 'DAY_LA_KHOA_BI_MAT_CHI_SERVER_BIET', // Mật khẩu để ký Token
      signOptions: { expiresIn: '1d' }, // Token sẽ hết hạn sau 1 ngày
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
