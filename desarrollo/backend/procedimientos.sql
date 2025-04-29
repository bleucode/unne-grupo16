-- ====================================
-- Verificar y crear el rol 'administrador' si no existe
-- ====================================
INSERT INTO rol (id_rol, nombre_rol)
SELECT 2, 'administrador'
WHERE NOT EXISTS (
    SELECT 1 FROM rol WHERE id_rol = 2
);

-- ====================================
-- Procedimiento: registrar_usuario
-- ====================================
DELIMITER //

CREATE PROCEDURE registrar_usuario (
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_dni VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_nro_celular VARCHAR(20),
    IN p_password VARCHAR(255),
    IN p_id_rol INT,
    IN p_calle VARCHAR(255),
    IN p_nro_calle VARCHAR(20),
    IN p_cod_postal VARCHAR(20),
    IN p_id_localidad INT
)
BEGIN
    DECLARE id_direccion_new INT;

    -- Insertar dirección
    INSERT INTO direccion (calle, nro_calle, cod_postal, id_localidad)
    VALUES (p_calle, p_nro_calle, p_cod_postal, p_id_localidad);

    SET id_direccion_new = LAST_INSERT_ID();

    -- Insertar usuario
    INSERT INTO usuario (
        nombre, apellido, dni, email, nro_celular, password, id_rol, id_direccion, estado
    )
    VALUES (
        p_nombre, p_apellido, p_dni, p_email, p_nro_celular, p_password, p_id_rol, id_direccion_new, TRUE
    );
END //

DELIMITER ;

-- ====================================
-- Procedimiento: update_user
-- ====================================
DELIMITER //

CREATE PROCEDURE update_user (
    IN p_id_usuario INT,
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_dni VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_nro_celular VARCHAR(20),
    IN p_password VARCHAR(255),
    IN p_id_rol INT,
    IN p_id_direccion INT,
    IN p_calle VARCHAR(255),
    IN p_nro_calle VARCHAR(20),
    IN p_cod_postal VARCHAR(20),
    IN p_id_localidad INT
)
BEGIN
    -- Actualizar dirección si se envía
    IF p_id_direccion IS NOT NULL THEN
        UPDATE direccion
        SET calle = p_calle,
            nro_calle = p_nro_calle,
            cod_postal = p_cod_postal,
            id_localidad = p_id_localidad
        WHERE id_direccion = p_id_direccion;
    END IF;

    -- Actualizar usuario
    UPDATE usuario
    SET nombre = p_nombre,
        apellido = p_apellido,
        dni = p_dni,
        email = p_email,
        nro_celular = p_nro_celular,
        password = COALESCE(p_password, password),
        id_rol = p_id_rol
    WHERE id_usuario = p_id_usuario;
END //

DELIMITER ;

-- ====================================
-- Procedimiento: delete_user (soft delete)
-- ====================================
DELIMITER //

CREATE PROCEDURE delete_user (
    IN p_id_usuario INT
)
BEGIN
    UPDATE usuario
    SET estado = FALSE
    WHERE id_usuario = p_id_usuario;
END //

DELIMITER ;
