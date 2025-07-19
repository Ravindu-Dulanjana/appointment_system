/*
  Warnings:

  - A unique constraint covering the columns `[dateTime]` on the table `AppointmentSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSlot_dateTime_key" ON "AppointmentSlot"("dateTime");
