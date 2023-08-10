/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");
