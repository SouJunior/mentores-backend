import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/service/prisma.service";
import { AppModule } from "src/app.module";
import { MentorFactory } from "src/test/factories/make-mentor";
import request from "supertest";

describe('Create mentor (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let mentorFactory: MentorFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
            providers: [MentorFactory, PrismaService]
        })
        .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));

        prisma = moduleRef.get(PrismaService);
        mentorFactory = moduleRef.get(MentorFactory);

        await app.init();
    });

    test("[POST] /mentor - Success case", async () => {
        const newMentor = await mentorFactory.makePrismaMentor();

        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: newMentor.fullName,
                email: newMentor.email,
                dateOfBirth: newMentor.dateOfBirth,
                password: newMentor.password,
            });

            console.log(response.body)

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: "Mentor created successfully",
        });

        const isMentorCreated = await prisma.mentors.findUnique({
            where: { email: newMentor.email },
        });

        expect(isMentorCreated).toBeTruthy();
        expect(isMentorCreated.fullName).toBe(newMentor.fullName);
    });

    test("[POST] /mentor - Error when email is already registered", async () => {
        const existingMentor = await mentorFactory.makePrismaMentor({
            email: "duplicated@instrete.com",
        });

        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Novo Mentor",
                email: existingMentor.email,
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Bad Request: User already exists");
    });

    test("[POST] /mentor - Error when date of birth is in the future", async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Mentor Test",
                email: "futuredate@instrete.com",
                dateOfBirth: futureDate.toISOString(),
                password: "Xandao@2024",
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
                dateOfBirth: "1990-01-01",
                password: "simplepass",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(
            "Password must have a minimum of 8 characters, a capital letter, a number and a symbol"
        );
    });

    test("[POST] /mentor - Error when email format is invalid", async () => {
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: "Invalid Email",
                email: "invalid-email",
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("Invalid e-mail format");
    });

    test("[POST] /mentor - Error when name exceeds character limit", async () => {
        const longName = "A".repeat(101);
        const response = await request(app.getHttpServer())
            .post("/mentor")
            .send({
                fullName: longName,
                email: "longname@instrete.com",
                dateOfBirth: "1990-01-01",
                password: "Xandao@2024",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("Maximum of 100 characters exceeded");
    });

    afterEach(async () => {
        await prisma.mentors.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });
});
