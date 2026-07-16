import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcrypt";
import { PrismaService } from "../prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import request from "supertest"
import { JwtService } from '@nestjs/jwt';

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

    test("[POST] /auth/login - Mentor login is succesfull", async () => {
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

    test("[POST] /auth/login - Fails if email is not confirmed", async () => {
        await prisma.mentors.create({
            data: {
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                dateOfBirth: new Date("1988-02-23"),
                password: await hash("Xandao@2024", 10),
                emailConfirmed: false,
            },
        });
    
        const response = await request(app.getHttpServer()).post("/auth/login").send({
            email: "shriyans0@instrete.com",
            password: "Xandao@2024",
            type: "mentor",
        });
    
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(
            "Your account is not activated yet. Check your e-mail inbox for instructions"
        );
    });

    test("[POST] /auth/login - Fails with incorrect password", async () => {
        const mentor = await prisma.mentors.create({
            data: {
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                dateOfBirth: new Date("1988-02-23"),
                password: await hash("Xandao@2024", 10),
                emailConfirmed: true,
                accessAttempt: 0,
            },
        });
    
        const response = await request(app.getHttpServer()).post("/auth/login").send({
            email: "shriyans0@instrete.com",
            password: "WrongPassword@2024",
            type: "mentor",
        });
    
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Invalid e-mail or password");
    
        const updatedMentor = await prisma.mentors.findUnique({
            where: { email: "shriyans0@instrete.com" },
        });
        expect(updatedMentor.accessAttempt).toBe(1);
    });    
    test("[POST] /auth/login - Blocks after 5 failed attempts", async () => {
        const mentor = await prisma.mentors.create({
            data: {
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                dateOfBirth: new Date("1988-02-23"),
                password: await hash("Xandao@2024", 10),
                emailConfirmed: true,
                accessAttempt: 4,
            },
        });
    
        const response = await request(app.getHttpServer()).post("/auth/login").send({
            email: "shriyans0@instrete.com",
            password: "WrongPassword@2024",
            type: "mentor",
        });

        console.log(response.body)
    
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Your account access is still blocked, because you dont redefined your password after five incorrect tries, please, click on 'Forgot my password' to begin the account restoration.");
    
        const updatedMentor = await prisma.mentors.findUnique({
            where: { email: "shriyans0@instrete.com" },
        });
        expect(updatedMentor.accessAttempt).toBe(5);
    });

test("[POST] /auth/login - Returns valid JWT token", async () => {
    await prisma.mentors.create({
        data: {
            fullName: "Super Xandão",
            email: "shriyans0@instrete.com",
            dateOfBirth: new Date("1988-02-23"),
            password: await hash("Xandao@2024", 10),
            emailConfirmed: true,
        },
    });

    const response = await request(app.getHttpServer()).post("/auth/login").send({
        email: "shriyans0@instrete.com",
        password: "Xandao@2024",
        type: "mentor",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    const jwtService = new JwtService({
        secret: process.env.JWT_SECRET,
    });
    const decoded = jwtService.decode(response.body.token) as { email: string };

    expect(decoded.email).toBe("shriyans0@instrete.com");
});
test("[POST] /auth/login - Fails with invalid type", async () => {
    await prisma.mentors.create({
        data: {
            fullName: "Super Xandão",
            email: "shriyans0@instrete.com",
            dateOfBirth: new Date("1988-02-23"),
            password: await hash("Xandao@2024", 10),
            emailConfirmed: true,
        },
    });

    const response = await request(app.getHttpServer()).post("/auth/login").send({
        email: "shriyans0@instrete.com",
        password: "Xandao@2024",
        type: "invalidType",
    });

    console.log(response.body)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('invalid e-mail or password');
});
test("[POST] /auth/login - Fails when required fields are missing", async () => {
    const response = await request(app.getHttpServer()).post("/auth/login").send({
        email: "shriyans0@instrete.com",
        type: "mentor",
    });

    console.log(response.body)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain("invalid e-mail or password");
});
test("[POST] /auth/login - Fails for deleted accounts", async () => {
    await prisma.mentors.create({
        data: {
            fullName: "Super Xandão",
            email: "shriyans0@instrete.com",
            dateOfBirth: new Date("1988-02-23"),
            password: await hash("Xandao@2024", 10),
            emailConfirmed: true,
            deleted: true,
        },
    });

    const response = await request(app.getHttpServer()).post("/auth/login").send({
        email: "shriyans0@instrete.com",
        password: "Xandao@2024",
        type: "mentor",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("invalid e-mail or password");
});

    afterEach(async () => {
        await prisma.mentors.deleteMany()
      })
});