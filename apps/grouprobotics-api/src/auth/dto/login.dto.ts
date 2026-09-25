import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email boş ola bilməz' })
  @IsEmail({}, { message: 'Email formatı düzgün deyil' })
  email!: string;

  @IsNotEmpty({ message: 'Şifrə boş ola bilməz' })
  @IsString()
  password!: string;
}