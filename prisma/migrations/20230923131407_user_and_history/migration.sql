/*
  Warnings:

  - You are about to drop the column `specialty` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "specialty";

-- CreateTable
CREATE TABLE "mentors" (
    "id" TEXT NOT NULL,
    "history_id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "specialties" TEXT[],
    "profile" TEXT,
    "profileKey" TEXT,
    "accessAttempt" INTEGER DEFAULT 0,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "duration" TEXT,
    "happened_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentors_history_id_key" ON "mentors"("history_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_email_key" ON "mentors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_code_key" ON "mentors"("code");

-- CreateIndex
CREATE INDEX "mentors_id_idx" ON "mentors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "history_mentee_id_key" ON "history"("mentee_id");

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
