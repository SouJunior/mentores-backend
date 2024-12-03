import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import request from "supertest";

describe('Create mentor (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
          }));

        prisma = moduleRef.get(PrismaService);

        await app.init();
    });

    test("[POST] /mentor - Success case", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Super Xandão",
                email: "shriyans0@instrete.com",
                emailConfirm: "shriyans0@instrete.com",
                dateOfBirth: "1988-02-23",
                password: "Xandao@2024",
                passwordConfirmation: "Xandao@2024"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: "Mentor created successfully",
        });

        const isMentorCreated = await prisma.mentors.findUnique({
            where: { email: "shriyans0@instrete.com" },
        });

        expect(isMentorCreated).toBeTruthy();
        expect(isMentorCreated.fullName).toBe("Super Xandão");
    });

    test("[POST] /mentor - Error when email is already registered", async () => {
        await prisma.mentors.create({
            data: {
                fullName: "Super Xandão",
                email: "duplicated@instrete.com",
                dateOfBirth: new Date("1988-02-23"),
                password: "hashedPassword",
                emailConfirmed: false,
                specialties: [],
            },
        });

        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Novo Mentor",
                email: "duplicated@instrete.com",
                emailConfirm: "duplicated@instrete.com",
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
                passwordConfirmation: "Xandao@2024"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Bad Request: User already exists");
    });

    test("[POST] /mentor - Error when emails do not match", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Mentor Test",
                email: "testemail@instrete.com",
                emailConfirm: "differentemail@instrete.com",
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
                passwordConfirmation: "Xandao@2024"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("The emails dont match");
    });

    test("[POST] /mentor - Error when passwords do not match", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Mentor Test",
                email: "testemail@instrete.com",
                emailConfirm: "testemail@instrete.com",
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
                passwordConfirmation: "DifferentPassword@2024"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(
            "The password does not match with the password confirmation"
        );
    });

    test("[POST] /mentor - Error when date of birth is in the future", async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Mentor Test",
                email: "futuredate@instrete.com",
                emailConfirm: "futuredate@instrete.com",
                dateOfBirth: futureDate.toISOString(),
                password: "Xandao@2024",
                passwordConfirmation: "Xandao@2024"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("The date must be before the current date");
    });

    test("[POST] /mentor - Error when any required field is missing", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Incomplete Data",
                email: "incomplete@instrete.com",
            });

            console.log(response.body)
    
        expect(response.statusCode).toBe(400);
        
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body.message).toContain("the 'password' field must not be empty");
    });

    test("[POST] /mentor - Error when password does not meet complexity requirements", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Weak Password",
                email: "weakpassword@instrete.com",
                emailConfirm: "weakpassword@instrete.com",
                dateOfBirth: "1990-01-01",
                password: "simplepass",
                passwordConfirmation: "simplepass"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(
            "Password must have a minimum of 8 characters, a capital letter, a number and a symbol"
        );
    });

    afterAll(async () => {
        await app.close();
    });
});
