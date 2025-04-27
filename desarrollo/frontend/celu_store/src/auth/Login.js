import React, { useState } from 'react';
import './Login.css'; 

function Login() {
  return (
    <div className="login-container">

      {/* Formulario de Login */}
      <div className="form-container">
        <div className="login-form">
          <h1>Iniciar sesión</h1>
          <form>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" placeholder="Correo electrónico" required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Contraseña" required />
            </div>
            <button type="submit" className="submit-button">Iniciar sesión</button>
          </form>
          <p>¿No tienes cuenta? <a href="/registro" style={{ color: '#dc2626' }}>Regístrate</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
