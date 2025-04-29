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
