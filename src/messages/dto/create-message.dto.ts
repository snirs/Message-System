import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    recciver: string;

    @IsNotEmpty()
    message: string;

    subject: string;

}