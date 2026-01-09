-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name_professional" TEXT,
ADD COLUMN     "workingDays" TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']::TEXT[];
