// Registro.js
import React, { useState } from 'react';
import './Registro.css'; // Asegúrate de que este archivo exista

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para el registro del usuario
    console.log('Correo:', email);
    console.log('Contraseña:', password);
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
