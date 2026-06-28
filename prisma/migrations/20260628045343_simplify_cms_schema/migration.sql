/*
  Warnings:

  - You are about to drop the column `bannerText` on the `HomepageContent` table. All the data in the column will be lost.
  - You are about to drop the column `heroImage` on the `HomepageContent` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[singletonKey]` on the table `HomepageContent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "HomepageContent" DROP COLUMN "bannerText",
DROP COLUMN "heroImage",
ADD COLUMN     "heroBackgroundImage" TEXT,
ADD COLUMN     "heroButtonLink" TEXT,
ADD COLUMN     "heroButtonText" TEXT,
ADD COLUMN     "heroImageOne" TEXT,
ADD COLUMN     "heroImageThree" TEXT,
ADD COLUMN     "heroImageTwo" TEXT,
ADD COLUMN     "singletonKey" TEXT NOT NULL DEFAULT 'homepage';

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "TextSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WoodType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WoodType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WoodCharacteristic" (
    "id" TEXT NOT NULL,
    "woodTypeId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WoodCharacteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WoodPriceGroup" (
    "id" TEXT NOT NULL,
    "woodTypeId" TEXT NOT NULL,
    "height" DECIMAL(10,2) NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "pricePerM3" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WoodPriceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WoodPriceVariant" (
    "id" TEXT NOT NULL,
    "woodPriceGroupId" TEXT NOT NULL,
    "length" DECIMAL(10,2) NOT NULL,
    "volumeM3" DECIMAL(12,6) NOT NULL,
    "pricePerPiece" DECIMAL(12,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WoodPriceVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WoodCharacteristic_woodTypeId_idx" ON "WoodCharacteristic"("woodTypeId");

-- CreateIndex
CREATE INDEX "WoodPriceGroup_woodTypeId_idx" ON "WoodPriceGroup"("woodTypeId");

-- CreateIndex
CREATE INDEX "WoodPriceVariant_woodPriceGroupId_idx" ON "WoodPriceVariant"("woodPriceGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageContent_singletonKey_key" ON "HomepageContent"("singletonKey");

-- AddForeignKey
ALTER TABLE "WoodCharacteristic" ADD CONSTRAINT "WoodCharacteristic_woodTypeId_fkey" FOREIGN KEY ("woodTypeId") REFERENCES "WoodType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WoodPriceGroup" ADD CONSTRAINT "WoodPriceGroup_woodTypeId_fkey" FOREIGN KEY ("woodTypeId") REFERENCES "WoodType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WoodPriceVariant" ADD CONSTRAINT "WoodPriceVariant_woodPriceGroupId_fkey" FOREIGN KEY ("woodPriceGroupId") REFERENCES "WoodPriceGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
