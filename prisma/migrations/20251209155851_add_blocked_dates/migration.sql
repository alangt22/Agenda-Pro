-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
