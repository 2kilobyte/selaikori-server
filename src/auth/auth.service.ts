import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ensure you have a PrismaService
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginSuccessResponse } from './dtos/successId.dto';
// import admin from 'firebase-admin';



@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        if (!createUserDto.mobileNumber) {
            throw new HttpException('Mobile number is empty', HttpStatus.BAD_REQUEST)
        }
        if (!createUserDto.password) {
            throw new HttpException('Password is empty', HttpStatus.BAD_REQUEST)
        }
        if (!createUserDto.name) {
            throw new HttpException('Name is empty', HttpStatus.BAD_REQUEST)
        }
        

        try {
            const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);
            // create user in the database

            const existingUser = await this.prisma.user.findUnique({
                where: { mobileNumber: createUserDto.mobileNumber }
            })

            if (!existingUser) {
                const newUser = await this.prisma.user.create({
                    data: {
                        mobileNumber: createUserDto.mobileNumber,
                        password: hashedPassword,
                        name: createUserDto.name,
                    }
                });
                delete newUser.password;
                return newUser;
            }else{
                throw new HttpException('Mobile number already registered', HttpStatus.CONFLICT);
            }
        } catch (error) {
            if (error.status === 409) {    
                throw new HttpException('Mobile number already registered', HttpStatus.CONFLICT);
            }else{
                throw new HttpException(error, 500);
            }
        }
    }


    // Verify otp currently under development.
    // async verifyOtp(userId: string, otp: string): Promise<boolean> {
    //     const otpRecord = await this.prisma.otp.findFirst({
    //         where: {
    //             userId: userId,
    //             code: otp,
    //             expiresAt: {
    //             gte: new Date(),
    //             },
    //         },
    //     });
    //     if (!otpRecord) {
    //         throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    //     }
    //     // Mark the user's phone as verified
    //     await this.prisma.user.update({
    //         where: { id: userId },
    //         data: { isPhoneVerified: true },
    //     });
    //     return true;
    // }

    async login(mobileNumber: string, password: string): Promise<LoginSuccessResponse> {
        const user = await this.prisma.user.findUnique({
        where: { mobileNumber },
        });
        if (!user) {
        throw new HttpException('Incorrect mobile number / password', HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        throw new HttpException('Incorrect mobile number / password', HttpStatus.UNAUTHORIZED);
        }
    
        const accessToken = this.jwt.sign({sub: user.id });

        return { successId: accessToken };
    }

    async logout(userId: string): Promise<void> {
        // Implement logout logic. This might involve invalidating tokens or sessions.
        // For simplicity, we'll just return a success message.
        console.log(`User ${userId} logged out.`);
    }

    async resetPassword(mobileNumber: string, newPassword: string, oldPassword: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await this.prisma.user.update({
        where: { mobileNumber },
        data: { password: hashedPassword },
        });
        return user;
    }


    async validateUser(userId: string) {
        return await this.prisma.user.findUnique({ where: { id: userId } });
    }
}
