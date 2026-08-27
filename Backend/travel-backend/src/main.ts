import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Kích hoạt CORS để Frontend có thể gọi API
  app.enableCors();

  // Cài đặt Swagger (Giao diện test API)
  const config = new DocumentBuilder()
    .setTitle('API Quản lý Đặt Tour')
    .setDescription('Danh sách các API của hệ thống Backend')
    .setVersion('1.0')
    .addBearerAuth() // Cho phép nhập Token
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
