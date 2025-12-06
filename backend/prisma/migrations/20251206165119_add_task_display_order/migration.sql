-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Task_projectId_displayOrder_idx" ON "Task"("projectId", "displayOrder");
