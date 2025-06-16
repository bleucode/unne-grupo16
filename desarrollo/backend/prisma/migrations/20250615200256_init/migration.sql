/*
  Warnings:

  - You are about to drop the column `id_tipo_pago` on the `venta` table. All the data in the column will be lost.
  - You are about to drop the `tipopago` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_metodo_pago` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `Venta_id_tipo_pago_fkey`;

-- DropIndex
DROP INDEX `Venta_id_tipo_pago_fkey` ON `venta`;

-- AlterTable
ALTER TABLE `venta` DROP COLUMN `id_tipo_pago`,
    ADD COLUMN `id_metodo_pago` INTEGER NOT NULL;

-- DropTable
DROP TABLE `tipopago`;

-- CreateTable
CREATE TABLE `CategoriaPago` (
    `id_categoria_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id_categoria_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetodoPago` (
    `id_metodo_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `id_categoria_pago` INTEGER NOT NULL,

    PRIMARY KEY (`id_metodo_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuota` (
    `id_cuota` INTEGER NOT NULL AUTO_INCREMENT,
    `id_metodo_pago` INTEGER NOT NULL,
    `numero_cuota` INTEGER NOT NULL,
    `interes_cuota` DOUBLE NULL,

    PRIMARY KEY (`id_cuota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetodoPago` ADD CONSTRAINT `MetodoPago_id_categoria_pago_fkey` FOREIGN KEY (`id_categoria_pago`) REFERENCES `CategoriaPago`(`id_categoria_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cuota` ADD CONSTRAINT `Cuota_id_metodo_pago_fkey` FOREIGN KEY (`id_metodo_pago`) REFERENCES `MetodoPago`(`id_metodo_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_metodo_pago_fkey` FOREIGN KEY (`id_metodo_pago`) REFERENCES `MetodoPago`(`id_metodo_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;
