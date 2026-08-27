import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TourModule } from './tour/tour.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';
import { ReviewModule } from './review/review.module';
import { PromotionModule } from './promotion/promotion.module';

@Module({
  imports: [PrismaModule, AuthModule, TourModule, OrderModule, UploadModule, ReviewModule, PromotionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
