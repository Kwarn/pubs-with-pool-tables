-- CreateTable
CREATE TABLE "MapLocation" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MapLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" SERIAL NOT NULL,
    "isCueDeposit" TEXT NOT NULL,
    "isJumpingAllowed" TEXT NOT NULL,
    "isPoundOnTable" TEXT NOT NULL,
    "isReservationAllowed" TEXT NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "size" TEXT,
    "quality" TEXT,
    "cost" DOUBLE PRECISION,
    "description" TEXT,
    "pubId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PubInformation" (
    "id" SERIAL NOT NULL,
    "numberOfTables" INTEGER,
    "tableQuality" TEXT,
    "tableCost" DOUBLE PRECISION,
    "cueQuality" TEXT,
    "hasChalk" TEXT,
    "wheelchairAccess" TEXT,
    "kidsFriendly" TEXT,

    CONSTRAINT "PubInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "rulesId" INTEGER NOT NULL,
    "informationId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT[],
    "isRequiresManualReview" BOOLEAN NOT NULL DEFAULT false,
    "pubInformationId" INTEGER,

    CONSTRAINT "Pub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pubId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pub_informationId_key" ON "Pub"("informationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES "Pub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MapLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_rulesId_fkey" FOREIGN KEY ("rulesId") REFERENCES "Rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_pubInformationId_fkey" FOREIGN KEY ("pubInformationId") REFERENCES "PubInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES "Pub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
