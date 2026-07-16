-- DropForeignKey
ALTER TABLE "calendlyInfo" DROP CONSTRAINT "calendlyInfo_mentorId_fkey";

-- AddForeignKey
ALTER TABLE "calendlyInfo" ADD CONSTRAINT "calendlyInfo_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
