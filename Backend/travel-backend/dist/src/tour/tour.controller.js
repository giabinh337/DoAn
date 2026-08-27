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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourController = void 0;
const common_1 = require("@nestjs/common");
const tour_service_1 = require("./tour.service");
const tour_dto_1 = require("./dto/tour.dto");
const swagger_1 = require("@nestjs/swagger");
let TourController = class TourController {
    constructor(tourService) {
        this.tourService = tourService;
    }
    seedData() {
        return this.tourService.seedData();
    }
    getCategories() {
        return this.tourService.getCategories();
    }
    getDestinations() {
        return this.tourService.getDestinations();
    }
    createDestination(body) {
        return this.tourService.createDestination(body);
    }
    getAllTours() {
        return this.tourService.getAllTours();
    }
    getTourById(id) {
        return this.tourService.getTourById(id);
    }
    createTour(body) {
        return this.tourService.createTour(body);
    }
    updateTour(id, body) {
        return this.tourService.updateTour(id, body);
    }
    deleteTour(id) {
        return this.tourService.deleteTour(id);
    }
};
exports.TourController = TourController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo dữ liệu Danh mục & Điểm đến MẪU (Nên bấm cái này đầu tiên)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TourController.prototype, "seedData", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách Danh mục' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TourController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('destinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách Điểm đến' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TourController.prototype, "getDestinations", null);
__decorate([
    (0, common_1.Post)('destinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Thêm Điểm đến mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tour_dto_1.CreateDestinationDto]),
    __metadata("design:returntype", void 0)
], TourController.prototype, "createDestination", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy toàn bộ danh sách Tour' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TourController.prototype, "getAllTours", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xem chi tiết 1 Tour (theo ID)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TourController.prototype, "getTourById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Thêm mới 1 Tour' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tour_dto_1.CreateTourDto]),
    __metadata("design:returntype", void 0)
], TourController.prototype, "createTour", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật/Sửa thông tin Tour' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, tour_dto_1.UpdateTourDto]),
    __metadata("design:returntype", void 0)
], TourController.prototype, "updateTour", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Tour' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TourController.prototype, "deleteTour", null);
exports.TourController = TourController = __decorate([
    (0, swagger_1.ApiTags)('Tour (Quản lý Tour)'),
    (0, common_1.Controller)('tour'),
    __metadata("design:paramtypes", [tour_service_1.TourService])
], TourController);
//# sourceMappingURL=tour.controller.js.map