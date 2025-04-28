-- CreateTable
CREATE TABLE `Localidad` (
    `id_localidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `id_provincia` INTEGER NOT NULL,

    PRIMARY KEY (`id_localidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provincia` (
    `id_provincia` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_provincia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccion` (
    `id_direccion` INTEGER NOT NULL AUTO_INCREMENT,
    `calle` VARCHAR(191) NOT NULL,
    `nro_calle` VARCHAR(191) NOT NULL,
    `cod_postal` VARCHAR(191) NOT NULL,
    `id_localidad` INTEGER NOT NULL,

    PRIMARY KEY (`id_direccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Retiro` (
    `id_retiro` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_retiro` DATETIME(3) NOT NULL,
    `estado_retiro` VARCHAR(191) NOT NULL,
    `id_venta` INTEGER NOT NULL,
    `id_direccion` INTEGER NOT NULL,

    PRIMARY KEY (`id_retiro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Envio` (
    `id_envio` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_envio` DATETIME(3) NOT NULL,
    `estado_envio` VARCHAR(191) NOT NULL,
    `cod_seguimiento` VARCHAR(191) NOT NULL,
    `id_venta` INTEGER NOT NULL,
    `id_direccion` INTEGER NOT NULL,

    PRIMARY KEY (`id_envio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VentaDetalle` (
    `id_venta_detalle` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precio` DOUBLE NOT NULL,
    `id_venta` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,

    PRIMARY KEY (`id_venta_detalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venta` (
    `id_venta` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_venta` DATETIME(3) NOT NULL,
    `total_venta` DOUBLE NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_tipo_pago` INTEGER NOT NULL,

    PRIMARY KEY (`id_venta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nro_celular` VARCHAR(191) NOT NULL,
    `id_direccion` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL,
    `estado` BOOLEAN NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id_producto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `especificacion` VARCHAR(191) NOT NULL,
    `precio` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL,
    `imagen` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL,
    `id_modelo` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,

    PRIMARY KEY (`id_producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marca` (
    `id_marca` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_marca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modelo` (
    `id_modelo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `id_marca` INTEGER NOT NULL,

    PRIMARY KEY (`id_modelo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Localidad` ADD CONSTRAINT `Localidad_id_provincia_fkey` FOREIGN KEY (`id_provincia`) REFERENCES `Provincia`(`id_provincia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD CONSTRAINT `Direccion_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `Localidad`(`id_localidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `Venta`(`id_venta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retiro` ADD CONSTRAINT `Retiro_id_direccion_fkey` FOREIGN KEY (`id_direccion`) REFERENCES `Direccion`(`id_direccion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Envio` ADD CONSTRAINT `Envio_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `Venta`(`id_venta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Envio` ADD CONSTRAINT `Envio_id_direccion_fkey` FOREIGN KEY (`id_direccion`) REFERENCES `Direccion`(`id_direccion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentaDetalle` ADD CONSTRAINT `VentaDetalle_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `Venta`(`id_venta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentaDetalle` ADD CONSTRAINT `VentaDetalle_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `Producto`(`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `Usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_direccion_fkey` FOREIGN KEY (`id_direccion`) REFERENCES `Direccion`(`id_direccion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `Rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_id_modelo_fkey` FOREIGN KEY (`id_modelo`) REFERENCES `Modelo`(`id_modelo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_id_marca_fkey` FOREIGN KEY (`id_marca`) REFERENCES `Marca`(`id_marca`) ON DELETE RESTRICT ON UPDATE CASCADE;
