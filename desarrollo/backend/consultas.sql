-- Crear la provincia "Corrientes" si no existe
INSERT INTO provincia (nombre)
SELECT 'Corrientes'
WHERE NOT EXISTS (
  SELECT 1 FROM provincia WHERE nombre = 'Corrientes'
);

-- Obtener id_provincia de "Corrientes"
SET @id_provincia := (
  SELECT id_provincia FROM provincia WHERE nombre = 'Corrientes' LIMIT 1
);

-- Crear localidad si no existe
INSERT INTO localidad (nombre, id_provincia)
SELECT 'NOMBRE_LOCALIDAD', @id_provincia
WHERE NOT EXISTS (
  SELECT 1 FROM localidad WHERE nombre = 'NOMBRE_LOCALIDAD'
);

-- Obtener id_localidad
SET @id_localidad := (
  SELECT id_localidad FROM localidad WHERE nombre = 'NOMBRE_LOCALIDAD' LIMIT 1
);

-- Crear dirección
INSERT INTO direccion (calle, nro_calle, cod_postal, id_localidad)
VALUES ('CALLE', 'NRO_CALLE', 'COD_POSTAL', @id_localidad);

-- Obtener id_direccion recién insertado
SET @id_direccion := LAST_INSERT_ID();

-- Crear rol "usuario" si no existe
INSERT INTO rol (nombre_rol)
SELECT 'usuario'
WHERE NOT EXISTS (
  SELECT 1 FROM rol WHERE nombre_rol = 'usuario'
);

-- Obtener id_rol de "usuario"
SET @id_rol := (
  SELECT id_rol FROM rol WHERE nombre_rol = 'usuario' LIMIT 1
);

-- Crear usuario
INSERT INTO usuario (
  nombre, apellido, dni, email, nro_celular,
  id_direccion, id_rol, password, fecha_registro, estado
)
VALUES (
  'NOMBRE', 'APELLIDO', 'DNI', 'EMAIL', 'NRO_CELULAR',
  @id_direccion, @id_rol, 'HASHED_PASSWORD', NOW(), TRUE
);

-- Obtener los tipos de roles
SELECT * FROM rol WHERE id_rol = 2;

-- Si no existe:
INSERT INTO rol (id_rol, nombre_rol) VALUES (2, 'administrador');

-- Actualizar dirección 
UPDATE direccion
SET
  calle = 'Nueva Calle',
  nro_calle = 123,
  cod_postal = '1234',
  id_localidad = 5
WHERE id_direccion = 10;

-- Actualizar usuario
UPDATE usuario
SET
  nombre = 'Nombre',
  apellido = 'Apellido',
  dni = '12345678',
  email = 'usuario@email.com',
  nro_celular = '1123456789',
  password = 'contraseña_encriptada',  -- solo si hay nueva
  id_rol = 2
WHERE id_usuario = 1;

-- Eliminar usuario

UPDATE usuario
SET estado = false
WHERE id_usuario = 1;

-- Crear la marca si no existe
INSERT INTO Marca (nombre)
SELECT 'Samsung'
WHERE NOT EXISTS (
  SELECT 1 FROM Marca WHERE nombre = 'Samsung'
);

-- Obtener id_marca
SET @id_marca := (
  SELECT id_marca FROM Marca WHERE nombre = 'Samsung' LIMIT 1
);

-- Crear el modelo si no existe
INSERT INTO Modelo (descripcion)
SELECT 'Galaxy S24'
WHERE NOT EXISTS (
  SELECT 1 FROM Modelo WHERE descripcion = 'Galaxy S24'
);

-- Obtener id_modelo
SET @id_modelo := (
  SELECT id_modelo FROM Modelo WHERE descripcion = 'Galaxy S24' LIMIT 1
);

-- Crear la categoría si no existe
INSERT INTO Categoria (nombre)
SELECT 'Celulares'
WHERE NOT EXISTS (
  SELECT 1 FROM Categoria WHERE nombre = 'Celulares'
);

-- Obtener id_categoria
SET @id_categoria := (
  SELECT id_categoria FROM Categoria WHERE nombre = 'Celulares' LIMIT 1
);

-- Crear el producto si no existe
INSERT INTO Producto (
  nombre, descripcion, especificacion, precio, precio_descuento,
  stock, imagen, activo, id_modelo, id_categoria, id_marca
)
SELECT
  'Galaxy S24 Ultra',
  'Smartphone de alta gama',
  '8GB RAM, 256GB ROM, Cámara 108MP',
  1200.00,
  1100.00,
  50,
  's24ultra.jpg',
  TRUE,
  @id_modelo,
  @id_categoria,
  @id_marca
WHERE NOT EXISTS (
  SELECT 1 FROM Producto WHERE nombre = 'Galaxy S24 Ultra'
);

-- Obtener id_producto
SET @id_producto := (
  SELECT id_producto FROM Producto WHERE nombre = 'Galaxy S24 Ultra' LIMIT 1
);

-- Consulta de verificación
SELECT * FROM Producto WHERE id_producto = @id_producto;

-- Actualizar los datos del producto (si ya existe)
UPDATE Producto
SET
  nombre = 'Galaxy S24 Ultra Plus',
  descripcion = 'Edición mejorada',
  especificacion = '12GB RAM, 512GB ROM, Cámara 200MP',
  precio = 1400.00,
  precio_descuento = 1300.00,
  stock = 30,
  imagen = 's24ultra_plus.jpg',
  activo = TRUE
WHERE nombre = 'Galaxy S24 Ultra';

-- Baja lógica del producto
UPDATE Producto
SET activo = FALSE
WHERE nombre = 'Galaxy S24 Ultra';
