import "dotenv/config"

import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { execSync } from "child_process"

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error("Please provide a database url environment variable")
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set("schema", schemaId)

    return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
    const databaseUrl = generateUniqueDatabaseUrl(schemaId)

    process.env.DATABASE_URL = databaseUrl

    execSync("npx prisma migrate deploy")

    console.log(databaseUrl)
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)

    await prisma.$disconnect()
})

