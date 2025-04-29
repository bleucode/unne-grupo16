import React, { useState, useEffect } from 'react';
import './Registro.css';
import { useNavigate } from 'react-router-dom';



function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    nro_celular: '',
    password: '',
    id_rol: 1,  // Rol de usuario común (aseguramos que este campo siempre esté presente)
    direccion: {
      calle: '',
      nro_calle: '',
      cod_postal: '',
      nombre_localidad: '',  // Localidad por nombre
    },
  });

  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    // Consumiendo la API para obtener localidades
    const fetchLocalidades = async () => {
      try {
        const response = await fetch('https://apis.datos.gob.ar/georef/api/localidades?provincia=18');
        const data = await response.json();
        setLocalidades(data.localidades); // Guardamos las localidades en el estado
      } catch (error) {
        console.error('Error al obtener localidades:', error);
      }
    };

    fetchLocalidades();
  }, []); // Esto solo se ejecuta una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("direccion")) {
      const field = name.split(".")[1]; // Extraemos el campo específico (calle, nro_calle, etc.)
      setFormData(prevData => ({
        ...prevData,
        direccion: {
          ...prevData.direccion,
          [field]: value,
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLocalidadChange = (e) => {
    const localidadSeleccionada = e.target.value;  // Ahora recibimos el nombre de la localidad
    setFormData(prevData => ({
      ...prevData,
      direccion: {
        ...prevData.direccion,
        nombre_localidad: localidadSeleccionada,  // Cambiamos a `nombre_localidad`
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegurándonos de que `id_rol` esté presente en los datos a enviar
    const completeFormData = {
      ...formData,
      id_rol: formData.id_rol || 2, // Si `id_rol` no está presente, asignamos el valor 2
    };

    try {
      // Enviar los datos de usuario junto con la dirección y localidad seleccionada
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeFormData),
      });

      if (response.ok) {
        alert('¡Usuario registrado exitosamente!');
        navigate('/login');
      } else {
        alert('Hubo un error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nro_celular"
            placeholder="Número de celular"
            value={formData.nro_celular}
            onChange={handleChange}
            required
          />

          {/* Campo de Localidad con datos obtenidos de la API */}
          <select
            name="direccion.nombre_localidad"
            value={formData.direccion.nombre_localidad}
            onChange={handleLocalidadChange}
            required
            className="custom-select"
          >
            <option value="">Seleccione una localidad</option>
            {localidades.map((localidad) => (
              <option key={localidad.id} value={localidad.nombre}>  {/* Aquí pasamos el nombre de la localidad */}
                {localidad.nombre}
              </option>
            ))}
          </select>

          {/* Campos de Dirección */}
          <input
            type="text"
            name="direccion.calle"
            placeholder="Calle"
            value={formData.direccion.calle}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion.nro_calle"
            placeholder="Número de calle"
            value={formData.direccion.nro_calle}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion.cod_postal"
            placeholder="Código Postal"
            value={formData.direccion.cod_postal}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
