import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth (Đăng nhập / Đăng ký)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đường dẫn: POST http://localhost:3000/auth/register
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  // Đường dẫn: POST http://localhost:3000/auth/login
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  async login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
