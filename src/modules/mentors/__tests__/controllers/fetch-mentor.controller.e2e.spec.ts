import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import request from "supertest"

describe('Fetch mentors (E2E)', () => {
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

    test("[GET] /mentor", async () => {
        await prisma.mentors.createMany({
            data: [
                {
                    fullName: "Mentor 1",
                    email: "mentor0@email.com",
                    dateOfBirth: new Date("1988-02-23"),
                    password: "Mentor@2024"
                },
                {
                    fullName: "Mentor 2",
                    email: "mentor1@email.com",
                    dateOfBirth: new Date("1988-02-23"),
                    password: "Mentor@2024"
                },
            ]

        })

        const response = (await request(app.getHttpServer()).get("/mentor"))
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([
            expect.objectContaining({
                fullName: "Mentor 1",
            }),
            expect.objectContaining({
                fullName: "Mentor 2",
            }),
        ]);        
    })
});