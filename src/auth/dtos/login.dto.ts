import { IsNotEmpty, IsString, IsEmpty } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty({ message: 'You have to provide mobile number.' })
    mobileNumber: string;

    @IsString()
    @IsEmpty({ message:'No password found.' })
    password: string;
}