-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "isCueDeposit" BOOLEAN NOT NULL,
    "isJumpingAllowed" BOOLEAN NOT NULL,
    "isPoundOnTable" BOOLEAN NOT NULL,
    "isReservationAllowed" BOOLEAN NOT NULL,

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
CREATE TABLE "Pub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "rulesId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_updatedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_updatedBy_AB_unique" ON "_updatedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_updatedBy_B_index" ON "_updatedBy"("B");

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES "Pub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MapLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_rulesId_fkey" FOREIGN KEY ("rulesId") REFERENCES "Rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub" ADD CONSTRAINT "Pub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_updatedBy" ADD CONSTRAINT "_updatedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Pub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_updatedBy" ADD CONSTRAINT "_updatedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
