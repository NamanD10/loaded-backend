/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Assignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Bid` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Load` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Load` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `loadId` on the `Assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bidId` on the `Assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transporterId` on the `Assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `loadId` on the `Bid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transporterId` on the `Bid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `shipperId` on the `Load` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_bidId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_loadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_transporterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Bid" DROP CONSTRAINT "Bid_loadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Bid" DROP CONSTRAINT "Bid_transporterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Load" DROP CONSTRAINT "Load_shipperId_fkey";

-- DropIndex
DROP INDEX "public"."User_phone_key";

-- AlterTable
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "loadId",
ADD COLUMN     "loadId" INTEGER NOT NULL,
DROP COLUMN "bidId",
ADD COLUMN     "bidId" INTEGER NOT NULL,
DROP COLUMN "transporterId",
ADD COLUMN     "transporterId" INTEGER NOT NULL,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Bid" DROP CONSTRAINT "Bid_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "loadId",
ADD COLUMN     "loadId" INTEGER NOT NULL,
DROP COLUMN "transporterId",
ADD COLUMN     "transporterId" INTEGER NOT NULL,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Load" DROP CONSTRAINT "Load_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "shipperId",
ADD COLUMN     "shipperId" INTEGER NOT NULL,
ADD CONSTRAINT "Load_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "phone",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_loadId_key" ON "public"."Assignment"("loadId");

-- AddForeignKey
ALTER TABLE "public"."Load" ADD CONSTRAINT "Load_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "public"."Load"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "public"."Load"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "public"."Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
