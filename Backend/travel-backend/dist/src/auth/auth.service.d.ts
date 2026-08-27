import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(body: any): Promise<{
        message: string;
        userId: string;
        email: string;
    }>;
    login(body: any): Promise<{
        message: string;
        access_token: string;
        role: string;
    }>;
}
