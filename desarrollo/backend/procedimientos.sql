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


-- ====================================
-- Procedimiento: crear compra
-- ====================================

DELIMITER $$

CREATE PROCEDURE sp_crear_venta (
  IN p_cliente_id INT,
  IN p_id_metodo_pago INT,
  IN p_cuota_id INT,
  IN p_direccion_envio_id INT,
  IN p_items_json JSON
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_total_venta FLOAT DEFAULT 0;
  DECLARE v_id_venta INT;

  -- Cursor para recorrer los items
  DECLARE v_producto_id INT;
  DECLARE v_cantidad INT;
  DECLARE v_precio_descuento FLOAT;
  DECLARE v_stock INT;
  DECLARE v_nombre_producto VARCHAR(255);

  DECLARE item_cursor CURSOR FOR
    SELECT 
      JSON_EXTRACT(j.value, '$.productoId') AS productoId,
      JSON_EXTRACT(j.value, '$.cantidad') AS cantidad
    FROM JSON_TABLE(p_items_json, '$[*]' COLUMNS (
      value JSON PATH '$'
    )) AS j;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Validar método de pago
  IF NOT EXISTS (SELECT 1 FROM MetodoPago WHERE id_metodo_pago = p_id_metodo_pago) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Método de pago inválido';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM MetodoPago mp
    JOIN CategoriaPago cp ON mp.id_categoria_pago = cp.id_categoria_pago
    WHERE mp.id_metodo_pago = p_id_metodo_pago AND cp.nombre = 'credito'
  ) THEN
    IF p_cuota_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM Cuota WHERE id_cuota = p_cuota_id AND id_metodo_pago = p_id_metodo_pago
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cuota inválida para este método de pago';
    END IF;
  END IF;

  -- Calcular total y validar stock
  OPEN item_cursor;
  read_loop: LOOP
    FETCH item_cursor INTO v_producto_id, v_cantidad;
    IF done THEN
      LEAVE read_loop;
    END IF;

    SELECT precio_descuento, stock, nombre INTO v_precio_descuento, v_stock, v_nombre_producto
    FROM Producto
    WHERE id_producto = v_producto_id AND activo = TRUE;

    IF v_precio_descuento IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = CONCAT('Producto ', v_producto_id, ' no disponible');
    END IF;

    IF v_stock < v_cantidad THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = CONCAT('No hay stock para el producto ', v_nombre_producto);
    END IF;

    SET v_total_venta = v_total_venta + (v_precio_descuento * v_cantidad);
  END LOOP;
  CLOSE item_cursor;

  -- Crear la venta
  INSERT INTO Venta (fecha_venta, total_venta, id_cliente, id_metodo_pago)
  VALUES (NOW(), v_total_venta, p_cliente_id, p_id_metodo_pago);
  SET v_id_venta = LAST_INSERT_ID();

  -- Reset cursor
  SET done = FALSE;
  OPEN item_cursor;
  detalle_loop: LOOP
    FETCH item_cursor INTO v_producto_id, v_cantidad;
    IF done THEN
      LEAVE detalle_loop;
    END IF;

    SELECT precio_descuento INTO v_precio_descuento
    FROM Producto
    WHERE id_producto = v_producto_id;

    -- Descontar stock
    UPDATE Producto
    SET stock = stock - v_cantidad
    WHERE id_producto = v_producto_id;

    -- Insertar detalle de venta
    INSERT INTO VentaDetalle (cantidad, precio, id_venta, id_producto)
    VALUES (v_cantidad, v_precio_descuento, v_id_venta, v_producto_id);
  END LOOP;
  CLOSE item_cursor;

  -- Crear registro de envío
  INSERT INTO Envio (fecha_envio, estado_envio, id_venta)
  VALUES (NOW(), 'Pendiente', v_id_venta);

  -- Retornar ID de venta (puedes extender a retornar JSON si lo usas desde una app)
  SELECT v_id_venta AS nueva_venta;

END$$

DELIMITER ;
