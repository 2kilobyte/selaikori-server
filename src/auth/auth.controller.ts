import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        
        return await this.authService.register(createUserDto);
    }

    // @Get('verify-otp/:userId/:otp')
    // async verifyOtp(@Param('userId') userId: string, @Param('otp') otp: string) {
    //     return await this.authService.verifyOtp(userId, otp);
    // }

    @Post('login')
    async login(@Body('mobileNumber') mobileNumber: string, @Body('password') password: string) {
        return await this.authService.login(mobileNumber, password);
    }

    @Get('logout/:userId')
    async logout(@Param('userId') userId: string) {
        return await this.authService.logout(userId);
    }

    @Put('reset-password/:mobileNumber')
    async resetPassword(@Param('mobileNumber') mobileNumber: string, @Body('newPassword') newPassword: string, @Body('oldPassword') oldPassword: string) {
        return await this.authService.resetPassword(mobileNumber, newPassword, oldPassword);
    }
}
