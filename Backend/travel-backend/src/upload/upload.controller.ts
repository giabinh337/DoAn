import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const uploadDest = join(process.cwd(), '..', '..', 'frontend', 'travel-frontend', 'public', 'images', 'uploads');
if (!fs.existsSync(uploadDest)) {
  fs.mkdirSync(uploadDest, { recursive: true });
}

@Controller('upload')
export class UploadController {
  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: uploadDest,
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const fileUrls = files.map(file => `/images/uploads/${file.filename}`);
    return { urls: fileUrls };
  }
}
