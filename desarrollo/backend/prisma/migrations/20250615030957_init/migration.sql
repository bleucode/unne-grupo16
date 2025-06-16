/*
  Warnings:

  - You are about to drop the column `id_envio` on the `venta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_venta]` on the table `Envio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_venta` to the `Envio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `Venta_id_envio_fkey`;

-- DropIndex
DROP INDEX `Venta_id_envio_fkey` ON `venta`;

-- AlterTable
ALTER TABLE `envio` ADD COLUMN `id_venta` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `venta` DROP COLUMN `id_envio`;

-- CreateIndex
CREATE UNIQUE INDEX `Envio_id_venta_key` ON `Envio`(`id_venta`);

-- AddForeignKey
ALTER TABLE `Envio` ADD CONSTRAINT `Envio_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `Venta`(`id_venta`) ON DELETE RESTRICT ON UPDATE CASCADE;
