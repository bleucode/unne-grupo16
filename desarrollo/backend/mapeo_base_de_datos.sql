
-- Script generado para crear las tablas físicas en MySQL

CREATE TABLE Provincia (
    id_provincia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Localidad (
    id_localidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_provincia INT NOT NULL,
    CONSTRAINT localidad_unique UNIQUE(nombre, id_provincia),
    FOREIGN KEY (id_provincia) REFERENCES Provincia(id_provincia)
);

CREATE TABLE Direccion (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    nro_calle VARCHAR(50) NOT NULL,
    cod_postal VARCHAR(20) NOT NULL,
    id_localidad INT NOT NULL,
    FOREIGN KEY (id_localidad) REFERENCES Localidad(id_localidad)
);

CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(255) NOT NULL
);

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nro_celular VARCHAR(50) UNIQUE NOT NULL,
    id_direccion INT NOT NULL,
    id_rol INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL,
    activo BOOLEAN NOT NULL,
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

CREATE TABLE Envio (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    fecha_envio DATETIME NOT NULL,
    estado_envio VARCHAR(255) NOT NULL,
    cod_seguimiento VARCHAR(255),
    id_venta INT UNIQUE NOT NULL
);

CREATE TABLE CategoriaPago (
    id_categoria_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

CREATE TABLE MetodoPago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_categoria_pago INT NOT NULL,
    FOREIGN KEY (id_categoria_pago) REFERENCES CategoriaPago(id_categoria_pago)
);

CREATE TABLE Cuota (
    id_cuota INT AUTO_INCREMENT PRIMARY KEY,
    id_metodo_pago INT NOT NULL,
    numero_cuota INT NOT NULL,
    interes_cuota FLOAT,
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodoPago(id_metodo_pago)
);

CREATE TABLE Venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATETIME NOT NULL,
    total_venta FLOAT NOT NULL,
    id_cliente INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodoPago(id_metodo_pago)
);

ALTER TABLE Envio
ADD CONSTRAINT fk_envio_venta FOREIGN KEY (id_venta) REFERENCES Venta(id_venta);

CREATE TABLE VentaDetalle (
    id_venta_detalle INT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT NOT NULL,
    precio FLOAT NOT NULL,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE Marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE Modelo (
    id_modelo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    especificacion TEXT NOT NULL,
    precio FLOAT NOT NULL,
    precio_descuento FLOAT NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL,
    id_modelo INT NOT NULL,
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,
    FOREIGN KEY (id_modelo) REFERENCES Modelo(id_modelo),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
    FOREIGN KEY (id_marca) REFERENCES Marca(id_marca)
);