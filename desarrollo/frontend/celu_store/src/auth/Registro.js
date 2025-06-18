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
    id_rol: 1,
    direccion: {
      calle: '',
      nro_calle: '',
      cod_postal: '',
      id_localidad: '',
      provincia_id: '',
    },
  });

  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/ubicacion/provincias');
        const data = await res.json();
        setProvincias(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener provincias:', error);
      }
    };
    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (!formData.direccion.provincia_id) {
        setLocalidades([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/api/ubicacion/provincias/${formData.direccion.provincia_id}/localidades`);
        const data = await res.json();
        const localidadesData = data.localidades || data;
        setLocalidades(Array.isArray(localidadesData) ? localidadesData : []);
      } catch (error) {
        console.error('Error al obtener localidades:', error);
      }
    };

    fetchLocalidades();
  }, [formData.direccion.provincia_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("direccion")) {
      const field = name.split(".")[1];
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

  const handleProvinciaChange = (e) => {
    const provincia_id = e.target.value;
    setFormData(prev => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        provincia_id,
        id_localidad: '',
      }
    }));
  };

  const handleLocalidadChange = (e) => {
    const id_localidad = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        id_localidad: id_localidad,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const completeFormData = {
        ...formData,
        id_rol: formData.id_rol || 2,
        fecha_registro: new Date().toISOString(),
        activo: true,
        direccion: {
          ...formData.direccion,
          provincia_id: Number(formData.direccion.provincia_id),
          id_localidad: Number(formData.direccion.id_localidad)
        }
    };
    console.log('Formulario enviado:', completeFormData); 
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeFormData),
      });

      if (response.ok) {
        alert('¡Usuario registrado exitosamente!');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        alert('Hubo un error al registrar el usuario: ' + (errorData.message || ''));
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
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
          <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          <input type="text" name="nro_celular" placeholder="Número de celular" value={formData.nro_celular} onChange={handleChange} required />

          <select
            className="custom-select"
            value={formData.direccion.provincia_id}
            onChange={handleProvinciaChange}
            required
          >
            <option value="">Seleccione una provincia</option>
            {Array.isArray(provincias) && provincias.map(p => (
              <option key={p.id_provincia} value={p.id_provincia}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            className="custom-select"
            name="direccion.id_localidad"
            value={formData.direccion.id_localidad}
            onChange={handleLocalidadChange}
            required
            disabled={!formData.direccion.provincia_id}
          >
            <option value="">Seleccione una localidad</option>
            {Array.isArray(localidades) && localidades.map(loc => (
              <option key={loc.id_localidad} value={loc.id_localidad}>
                {loc.nombre}
              </option>
            ))}
          </select>

          <input type="text" name="direccion.calle" placeholder="Calle" value={formData.direccion.calle} onChange={handleChange} required />
          <input type="text" name="direccion.nro_calle" placeholder="Número de calle" value={formData.direccion.nro_calle} onChange={handleChange} required />
          <input type="text" name="direccion.cod_postal" placeholder="Código Postal" value={formData.direccion.cod_postal} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;

