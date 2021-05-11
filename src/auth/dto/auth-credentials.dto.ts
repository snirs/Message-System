import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    userName: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}