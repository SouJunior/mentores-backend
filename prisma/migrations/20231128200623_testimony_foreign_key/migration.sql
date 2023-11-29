/*
  Warnings:

  - A unique constraint covering the columns `[mentor_id]` on the table `testimony` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "testimony" ADD COLUMN     "mentor_id" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "testimony_mentor_id_key" ON "testimony"("mentor_id");

-- AddForeignKey
ALTER TABLE "testimony" ADD CONSTRAINT "testimony_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
