/*
  Warnings:

  - You are about to drop the column `history_id` on the `mentors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mentor_id]` on the table `history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mentor_id` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mentors" DROP CONSTRAINT "mentors_history_id_fkey";

-- DropIndex
DROP INDEX "mentors_history_id_key";

-- AlterTable
ALTER TABLE "history" ADD COLUMN     "mentor_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "history_id";

-- CreateIndex
CREATE UNIQUE INDEX "history_mentor_id_key" ON "history"("mentor_id");

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
