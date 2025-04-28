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

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      setError('Por favor ingrese tanto el correo electrónico como la contraseña');
      return;
    }

    try {
      // Realizamos la solicitud POST al backend
      const response = await fetch('http://localhost:4000/api/auth/login', {  // Cambia la URL al endpoint correcto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el login es exitoso, puedes almacenar el token o redirigir al usuario
        localStorage.setItem('token', data.token); // Guardar el token en el localStorage (opcional)
        console.log('Usuario autenticado:', data.user);
        // Redirigir a otra página (por ejemplo, al dashboard)
        window.location.href = '/';
      } else {
        setError(data.error); // Si ocurre un error, lo mostramos
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
