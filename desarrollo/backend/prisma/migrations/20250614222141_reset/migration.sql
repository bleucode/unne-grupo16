/*
  Warnings:

  - You are about to drop the column `id_direccion` on the `envio` table. All the data in the column will be lost.
  - You are about to drop the column `id_venta` on the `envio` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `marca` table. All the data in the column will be lost.
  - You are about to drop the column `id_marca` on the `modelo` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `retiro` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dni]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nro_celular]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `Marca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activo` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_marca` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_descuento` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_envio` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `envio` DROP FOREIGN KEY `Envio_id_direccion_fkey`;

-- DropForeignKey
ALTER TABLE `envio` DROP FOREIGN KEY `Envio_id_venta_fkey`;

-- DropForeignKey
ALTER TABLE `modelo` DROP FOREIGN KEY `Modelo_id_marca_fkey`;

-- DropForeignKey
ALTER TABLE `retiro` DROP FOREIGN KEY `Retiro_id_direccion_fkey`;

-- DropForeignKey
ALTER TABLE `retiro` DROP FOREIGN KEY `Retiro_id_venta_fkey`;

-- DropIndex
DROP INDEX `Envio_id_direccion_fkey` ON `envio`;

-- DropIndex
DROP INDEX `Envio_id_venta_fkey` ON `envio`;

-- DropIndex
DROP INDEX `Modelo_id_marca_fkey` ON `modelo`;

-- AlterTable
ALTER TABLE `envio` DROP COLUMN `id_direccion`,
    DROP COLUMN `id_venta`,
    MODIFY `cod_seguimiento` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `marca` DROP COLUMN `descripcion`,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `modelo` DROP COLUMN `id_marca`;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `estado`,
    ADD COLUMN `activo` BOOLEAN NOT NULL,
    ADD COLUMN `id_marca` INTEGER NOT NULL,
    ADD COLUMN `precio_descuento` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `estado`,
    ADD COLUMN `activo` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `venta` ADD COLUMN `id_envio` INTEGER NOT NULL;

-- DropTable
DROP TABLE `retiro`;

-- CreateTable
CREATE TABLE `TipoPago` (
    `id_tipo_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `metodo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_tipo_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_dni_key` ON `Usuario`(`dni`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_nro_celular_key` ON `Usuario`(`nro_celular`);

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_tipo_pago_fkey` FOREIGN KEY (`id_tipo_pago`) REFERENCES `TipoPago`(`id_tipo_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_envio_fkey` FOREIGN KEY (`id_envio`) REFERENCES `Envio`(`id_envio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_id_marca_fkey` FOREIGN KEY (`id_marca`) REFERENCES `Marca`(`id_marca`) ON DELETE RESTRICT ON UPDATE CASCADE;
