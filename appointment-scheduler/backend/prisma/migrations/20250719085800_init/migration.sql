-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AppointmentSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slotId" INTEGER NOT NULL,
    CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AppointmentSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_slotId_key" ON "Appointment"("slotId");
