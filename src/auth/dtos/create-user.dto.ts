import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty({ message: 'You have to provide mobile number.' })
    mobileNumber: string;

    @IsString()
    @MinLength(8, { message: 'set a hard password min 8 char' })
    password: string;

    @IsNotEmpty({message: 'You have to provide name'})
    name: string;
}