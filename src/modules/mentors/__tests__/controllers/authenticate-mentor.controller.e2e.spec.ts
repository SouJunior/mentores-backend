import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcrypt";
import { PrismaService } from "prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import request from "supertest"

describe('Authenticate mentor (E2E)', () => {
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

    test("[POST] /auth/login", async () => {
        await prisma.mentors.create({
            data: {
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                dateOfBirth: new Date("1988-02-23"),
                password: await hash("Xandao@2024", 10)
            }
        })

        await prisma.mentors.update({
            data: {
                emailConfirmed: true
            }, 
            where: { email: "shriyans0@instrete.com"}
        })

        const response = (await request(app.getHttpServer()).post("/auth/login").send({
            email: "shriyans0@instrete.com",
            password: "Xandao@2024",
            type: "mentor"
        }))
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            token: expect.any(String),
            info: expect.objectContaining({
                id: expect.any(String),
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
            })
        });
    })
});