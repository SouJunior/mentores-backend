import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import request from "supertest"

describe('Create mentor (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)

        await app.init()
    })

    test("[POST] /mentor", async () => {
        const response = (await request(app.getHttpServer()).post("/mentor").send({
            fullName: "Super Xandão",
            email: "shriyans0@instrete.com",
            emailConfirm: "shriyans0@instrete.com",
            dateOfBirth: "1988-02-23",
            password: "Xandao@2024",
            passwordConfirmation: "Xandao@2024"
        }))
        
        expect(response.statusCode).toBe(201)

        const isMentorCreated = await prisma.mentors.findUnique({
            where: {
                email: "shriyans0@instrete.com"
            }
        })
        
        expect(isMentorCreated).toBeTruthy()
    })
});