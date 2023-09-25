import { HttpException, HttpStatus } from "@nestjs/common"

export class CustomMentorsBadRequestException extends HttpException {
    constructor(message: string) {
        super(`Bad Request: ${message}`, HttpStatus.BAD_REQUEST)
    }
}