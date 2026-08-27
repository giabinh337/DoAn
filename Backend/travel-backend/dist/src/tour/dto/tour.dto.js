"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDestinationDto = exports.UpdateTourDto = exports.CreateTourDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateTourDto {
}
exports.CreateTourDto = CreateTourDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID của Danh mục (VD: 1 - Nghỉ dưỡng)' }),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID của Điểm đến (VD: 1 - Phú Quốc)' }),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "destinationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tour Khám Phá Phú Quốc 3N2Đ', description: 'Tên của Tour' }),
    __metadata("design:type", String)
], CreateTourDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://images.unsplash.com/...', description: 'Link ảnh đại diện Tour', required: false }),
    __metadata("design:type", String)
], CreateTourDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['/images/uploads/1.jpg', '/images/uploads/2.jpg'], description: 'Danh sách ảnh', required: false }),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "gallery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5500000, description: 'Giá của Tour (VND)' }),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Khám phá văn hóa Tây Bắc...', description: 'Tổng quan chuyến đi', required: false }),
    __metadata("design:type", String)
], CreateTourDto.prototype, "overview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '["Trải nghiệm văn hóa", "Cảnh quan đẹp"]', description: 'Điểm nổi bật', required: false }),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "highlights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ "day": 1, "activity": "Đón sân bay" }, { "day": 2, "activity": "Lặn ngắm san hô" }],
        description: 'Lịch trình chi tiết (Lưu dạng JSON)'
    }),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "itinerary", void 0);
class UpdateTourDto extends (0, swagger_1.PartialType)(CreateTourDto) {
}
exports.UpdateTourDto = UpdateTourDto;
class CreateDestinationDto {
}
exports.CreateDestinationDto = CreateDestinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Côn Đảo' }),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Miền Nam' }),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "region", void 0);
//# sourceMappingURL=tour.dto.js.map