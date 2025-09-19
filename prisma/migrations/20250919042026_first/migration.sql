-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SHIPPER', 'TRANSPORTER');

-- CreateEnum
CREATE TYPE "public"."LoadStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Load" (
    "id" TEXT NOT NULL,
    "shipperId" TEXT NOT NULL,
    "sourceLocation" TEXT NOT NULL,
    "destinationLocation" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "typeOfGoods" TEXT NOT NULL,
    "status" "public"."LoadStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bid" (
    "id" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "transporterId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."BidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,
    "transporterId" TEXT NOT NULL,
    "agreedAmount" DOUBLE PRECISION NOT NULL,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

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
