import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ 
    example: 'test@example.com', 
    description: 'Email của tài khoản' 
  })
  email: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Mật khẩu đăng nhập' 
  })
  password: string;
}
