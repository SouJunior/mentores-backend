import { HttpException, HttpStatus } from "@nestjs/common"

export class CustomMentorsNotFoundException extends HttpException {
    constructor(message: string) {
        super(`Not Found: ${message}`, HttpStatus.NOT_FOUND)
    }
}