import React, { useState } from 'react';
import './Login.css'; 

function Login() {
  // Estado para manejar el correo y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Estado para manejar el error

  // Función para manejar el envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError('Por favor ingrese tanto el correo electrónico como la contraseña');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Respuesta del login:', data.token);
    localStorage.setItem('token', data.token)

    console.log(localStorage.getItem('token'));
    if (response.ok) {
      console.log('Guardando token:', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.id_rol === 1) {
        window.location.href = '/';
      } else if (data.user.id_rol === 3) { // administrador
        window.location.href = '/admin?section=usuarios';
      } else if (data.user.id_rol === 2) { // vendedor
        window.location.href = '/admin?section=ventas';
      } else {
        window.location.href = '/';
      }
    } else {
      setError(data.error);
    }

  } catch (error) {
    console.error('Error en el login:', error);
    setError('Ocurrió un error al intentar iniciar sesión.');
  }
};

  

  return (
    <div className="login-container">
      {/* Formulario de Login */}
      <div className="form-container">
        <div className="login-form">
          <h1>Iniciar sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="submit-button">Iniciar sesión</button>
          </form>

          {/* Mostrar error si existe */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <p>¿No tienes cuenta? <a href="/registro" style={{ color: '#dc2626' }}>Regístrate</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
