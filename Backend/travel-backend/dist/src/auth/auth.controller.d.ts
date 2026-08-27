import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: AuthDto): Promise<{
        message: string;
        userId: string;
        email: string;
    }>;
    login(body: AuthDto): Promise<{
        message: string;
        access_token: string;
        role: string;
    }>;
}
