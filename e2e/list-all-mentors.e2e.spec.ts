import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/service/prisma.service";
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

    test("[GET] /mentor - returns correctly the created mentors", async () => {
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

    test("[GET] /mentor - Returns empty list when no mentors exist", async () => {
        const response = await request(app.getHttpServer()).get("/mentor");
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
    
    test("[GET] /mentor - Returns correct fields in the response", async () => {
        await prisma.mentors.createMany({
            data: [
                {
                    fullName: "Super Xandão",
                    email: "shriyans0@instrete.com",
                    dateOfBirth: new Date("1988-02-23"),
                    password: "Mentor@2024"
                },
            ],
        });
    
        const response = await request(app.getHttpServer()).get("/mentor");
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                gender: "",
                aboutMe: null,
                specialties: expect.any(Array),
                role: null,
                dateOfBirth: "1988-02-23T00:00:00.000Z",
                emailConfirmed: false,
                registerComplete: false,
                accessAttempt: 0,
                code: null,
                deleted: false,
                calendlyInfo: null,
                history: null,
                testimony: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        ]);
    });
    
    test("[GET] /mentor - Does not return soft-deleted mentors", async () => {
        await prisma.mentors.createMany({
            data: [
                { fullName: "Active Mentor",
                  email: "active@email.com",
                  deleted: false,
                  password: "hashed",
                  dateOfBirth: new Date()
                },

                { fullName: "Deleted Mentor", 
                  email: "deleted@email.com", 
                  deleted: true,
                  password: "hashed",
                  dateOfBirth: new Date()
                },
            ],
        });
    
        const response = await request(app.getHttpServer()).get("/mentor");
    
        console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].email).toBe("active@email.com");
    });

    test("[GET] /mentor - Returns empty list when no mentors exist", async () => {
        const response = await request(app.getHttpServer()).get("/mentor");
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });    
    
    afterEach(async () => {
        await prisma.mentors.deleteMany()
      })

      afterAll(async () => {
        await app.close();
    });
});