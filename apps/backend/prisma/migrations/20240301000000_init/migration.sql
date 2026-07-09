-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CASHIER');

-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CASHIER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateTable medicines
CREATE TABLE "medicines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "generic_name" TEXT,
    "manufacturer" TEXT,
    "rack_location" TEXT,
    "min_stock_level" INTEGER NOT NULL DEFAULT 10,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "medicines_name_key" ON "medicines"("name");

-- CreateTable batches
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "buying_price" DECIMAL(10,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "batches_medicine_id_batch_number_key" ON "batches"("medicine_id", "batch_number");

-- CreateTable medicine_knowledge
CREATE TABLE "medicine_knowledge" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "generic_ingredient" TEXT NOT NULL,
    "therapeutic_category" TEXT NOT NULL,
    "drug_class" TEXT NOT NULL,
    "common_uses" TEXT[],
    "age_restrictions" TEXT,
    "adult_dosage" TEXT NOT NULL,
    "pediatric_dosage" TEXT,
    "is_otc" BOOLEAN NOT NULL DEFAULT true,
    "contraindications" TEXT[],
    "common_side_effects" TEXT[],
    "pregnancy_warnings" TEXT NOT NULL,
    "breastfeeding_warnings" TEXT NOT NULL,
    "food_instructions" TEXT,
    "storage_conditions" TEXT,
    "important_warnings" TEXT NOT NULL,
    "search_keywords" TEXT[],
    "synonyms" TEXT[],
    "embedding_vector" DOUBLE PRECISION[],
    "enrichment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "failure_log" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "medicine_knowledge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "medicine_knowledge_medicine_id_key" ON "medicine_knowledge"("medicine_id");

-- CreateTable sales
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable sale_items
CREATE TABLE "sale_items" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_knowledge" ADD CONSTRAINT "medicine_knowledge_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
