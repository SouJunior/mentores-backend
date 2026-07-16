-- CreateTable
CREATE TABLE "accountDeletionFeedback" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "reasonOption" TEXT NOT NULL,
    "reasonText" TEXT,
    "usabilityRating" TEXT NOT NULL,
    "satisfactionRating" TEXT NOT NULL,
    "userExperienceFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountDeletionFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accountDeletionFeedback_mentor_id_key" ON "accountDeletionFeedback"("mentor_id");

-- AddForeignKey
ALTER TABLE "accountDeletionFeedback" ADD CONSTRAINT "accountDeletionFeedback_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
