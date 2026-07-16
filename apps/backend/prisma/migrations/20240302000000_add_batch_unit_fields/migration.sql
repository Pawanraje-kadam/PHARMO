-- AlterTable: Add unit conversion columns to batches
ALTER TABLE "batches" ADD COLUMN "purchase_unit" TEXT NOT NULL DEFAULT 'tablet';
ALTER TABLE "batches" ADD COLUMN "units_per_tablet" DOUBLE PRECISION NOT NULL DEFAULT 1;
