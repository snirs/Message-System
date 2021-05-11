import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload';
import { Message } from 'src/messages/message.entity';

@Injectable()
export class AuthService {
    private accessToken;

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(credentialsDto: AuthCredentialsDto) {
        const userName = await this.userRepository.signUp(credentialsDto);
        return await this.getAccessToken(userName);
    }

    async signin(credentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const userName =  await this.userRepository.validatePassword(credentialsDto);
        if (!userName) {
            throw new UnauthorizedException('Wrong username or password');
        }
        return await this.getAccessToken(userName)
    }

    async getAccessToken(userName: string) {
        const payload: JwtPayload = { userName }
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
    }
}
