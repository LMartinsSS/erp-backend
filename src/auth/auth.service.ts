import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    async signIn(user: User): Promise<{ access_token: string }> {
        const { email, password } = user

        const userSignIn = await prisma.user.findUnique({
            where: {
                email
            }
        })
        // const user = await this.usersService.findOne({ email });
        if (userSignIn?.password !== password) {
            throw new UnauthorizedException();
        }
        const payload = { sub: userSignIn.id, username: userSignIn.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}