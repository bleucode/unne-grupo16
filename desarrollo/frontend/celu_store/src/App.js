import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import Registro from './auth/Registro';
import AdminPanel from './admin/AdminPanel';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Factura from './pages/Factura';
import { FaShoppingCart } from 'react-icons/fa';

/* Componentes representativos simples */

function Home({ productos, agregarAlCarrito }) {
  return (
    <div>
      <h2>Productos</h2>
      <div className="offers products">
        {productos.map((p) => (
          <div key={p.id_producto} className="product-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>${p.precio}</p>
            <button
              className="add-to-cart-button"
              onClick={() =>
                agregarAlCarrito({
                  id: p.id_producto,
                  name: p.nombre,
                  price: p.precio,
                  image: p.imagen,
                })
              }
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuienesSomos() {
  return (
    <div>
      <h2>¿Quiénes Somos?</h2>
      <p>Somos una empresa dedicada a la venta de celulares.</p>
    </div>
  );
}

function Comercializacion() {
  return (
    <div>
      <h2>Comercialización</h2>
      <p>Ofrecemos múltiples métodos de pago y envío.</p>
    </div>
  );
}

function Sucursales() {
  return (
    <div>
      <h2>Sucursales</h2>
      <p>Disponemos de sucursales físicas en varias ciudades.</p>
    </div>
  );
}

function Contactenos() {
  return (
    <div>
      <h2>Contáctenos</h2>
      <p>Puedes escribirnos a contacto@celustore.com o llamarnos.</p>
    </div>
  );
}

/* Componente principal */

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setLoggedIn(true);
    if (user.id_rol === 1) {
        window.location.href = '/';
      } else if (user.id_rol === 3) { // administrador
        window.location.href = '/admin?section=usuarios';
      } else if (user.id_rol === 2) { // vendedor
        window.location.href = '/admin?section=ventas';
      } else {
        window.location.href = '/';
      }
  };

  const agregarAlCarrito = (producto) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === producto.id);
      if (exists) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...producto, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-links">
            <Link to="/">Productos</Link>
            <Link to="/quienes-somos">¿Quiénes Somos?</Link>
            <Link to="/comercializacion">Comercialización</Link>
            <Link to="/sucursales">Sucursales</Link>
            <Link to="/contactenos">Contáctenos</Link>
          </div>

          <div className="navbar-account">
            {loggedIn ? (
              <>
                <span>Hola, {user.nombre}!</span>
                {(user.id_rol === 2 || user.id_rol === 3) && (
                  <Link to="/admin">
                    <button>{user.id_rol === 3 ? 'Admin' : 'Ventas'}</button>
                  </Link>
                )}
                <button onClick={handleLogout}>Salir</button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button>Mi Cuenta</button>
                </Link>
                <Link to="/registro">
                  <button>Registrarse</button>
                </Link>
              </>
            )}
            <Link to="/carrito" className="cart-icon">
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </div>
        </nav>

        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/"
            element={
              <Home
                productos={productos}
                agregarAlCarrito={agregarAlCarrito}
              />
            }
          />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route
            path="/comercializacion"
            element={<Comercializacion />}
          />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/contactenos" element={<Contactenos />} />

          <Route
            path="/admin"
            element={
              loggedIn ? <AdminPanel /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/carrito"
            element={
              loggedIn ? (
                <Carrito
                  cartItems={cartItems}
                  clearCart={clearCart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/checkout"
            element={
              loggedIn ? (
                <Checkout
                  cartItems={cartItems}
                  clearCart={clearCart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/factura/:id"
            element={
              loggedIn ? <Factura /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
