import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '2d') as `${number}${'s' | 'm' | 'h' | 'd'}` },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UsersRepository],
})
export class AuthModule { }