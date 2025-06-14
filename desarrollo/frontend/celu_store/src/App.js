import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import Registro from './auth/Registro';
import AdminPanel from './admin/AdminPanel';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import { FaShoppingCart } from 'react-icons/fa';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos', err));
  }, []);

  const agregarAlCarrito = (producto) => {
    setCartItems((prevCartItems) => {
      const existingProduct = prevCartItems.find((item) => item.id === producto.id);
      if (existingProduct) {
        return prevCartItems.map((item) =>
          item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCartItems, { ...producto, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className="container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-links">
            <a href="#">¿Quiénes Somos?</a>
            <a href="#">Comercialización</a>
            <a href="#">Sucursales</a>
            <a href="#">Contáctenos</a>
          </div>
          <div className="navbar-account">
            <Link to="/login"><button>Mi Cuenta</button></Link>
            <Link to="/carrito" className="cart-icon">
              <FaShoppingCart size={10} />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </Link>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {/* ... tu header y categorías */}

                <div className="offers">
                  <h2>PRODUCTOS</h2>
                  <div className="products">
                    {productos.map((producto) => (
                      <div key={producto.id_producto} className="product-card">
                        <img src={producto.imagen} alt={producto.nombre} />
                        <h3>{producto.nombre}</h3>
                        <p>${producto.precio}</p>
                        <button
                          className="add-to-cart-button"
                          onClick={() =>
                            agregarAlCarrito({
                              id: producto.id_producto,
                              name: producto.nombre,
                              price: producto.precio,
                              image: producto.imagen,
                            })
                          }
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/carrito" element={<Carrito cartItems={cartItems} clearCart={clearCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
