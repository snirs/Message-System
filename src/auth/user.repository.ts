import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private activeSession;

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string>{
        const {userName, password} = authCredentialsDto;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.userName = userName;
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
        } catch (err) {
            if (err.code === '23505') { //duplicate userName
                throw new ConflictException("Username already exists")
            } else {
                throw new InternalServerErrorException();
            }
        }
        return userName;
    }

    async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {userName, password,} = authCredentialsDto;
        const user = await this.findOne({userName});
        if (user && await user.validatePassword(password)) {
            return user.userName;
        }
        else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    getActiveSession() {
        return this.activeSession;
    }
}