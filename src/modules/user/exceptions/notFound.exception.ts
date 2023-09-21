import { HttpException, HttpStatus } from "@nestjs/common"

export class CustomUsersNotFoundException extends HttpException {
    constructor(message: string) {
        super(`Not Found: ${message}`, HttpStatus.NOT_FOUND)
    }
}