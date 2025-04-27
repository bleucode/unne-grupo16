import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import Registro from './auth/Registro';
import AdminPanel from './admin/AdminPanel';
import Carrito from './pages/Carrito'; // Asegúrate de importar Carrito correctamente
import { FaShoppingCart } from 'react-icons/fa';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar productos al carrito
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

  // ✅ Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const productos = [
    { id: 1, name: 'Celular', price: 3000, image: 'https://via.placeholder.com/150?text=Celular' },
    { id: 2, name: 'Smartwatch', price: 1500, image: 'https://via.placeholder.com/150?text=Smartwatch' },
    { id: 3, name: 'Auriculares', price: 800, image: 'https://via.placeholder.com/150?text=Auriculares' },
  ];

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
            <Link to="/login">
              <button>Mi Cuenta</button>
            </Link>
            <Link to="/carrito" className="cart-icon">
              <FaShoppingCart size={10} />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </Link>
          </div>
        </nav>

        {/* Rutas de la página */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="header">
                  <div className="logo">
                    <span>Mi Tienda</span>
                  </div>
                  <div className="search-bar">
                    <input type="text" placeholder="Buscar productos..." />
                    <button>Buscar</button>
                  </div>
                </div>

                <div className="categories">
                  {['Celulares', 'Smartwatch', 'Auriculares', 'Cargadores', 'Memorias SD'].map((item) => (
                    <div key={item} className="category">
                      <div className="icon">📱</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="offers">
                  <h2>PRODUCTOS</h2>
                  <div className="products">
                    {productos.map((producto) => (
                      <div key={producto.id} className="product-card">
                        <img src={producto.image} alt={producto.name} />
                        <h3>{producto.name}</h3>
                        <p>${producto.price}</p>
                        <button className="add-to-cart-button" onClick={() => agregarAlCarrito(producto)}>
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

          {/* ✅ Acá pasamos también clearCart además de cartItems */}
          <Route path="/carrito" element={<Carrito cartItems={cartItems} clearCart={clearCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
