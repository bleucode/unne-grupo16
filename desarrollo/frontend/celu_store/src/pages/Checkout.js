import React, { useState, useEffect } from 'react';
import '../pages/Carrito.css'; // Para mantener la misma estética
import { useNavigate } from 'react-router-dom';

function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();
  const discount = 40000;
  const subtotal = cartItems.reduce((acc, product) => 
    acc + ((product.priceOffer || product.price) * product.quantity), 0
  );
  const total = subtotal - discount;

  // Simulación de obtener usuario de token
  const [user, setUser] = useState(null); // null si no está logueado
  const [loadingUser, setLoadingUser] = useState(true);

  // Formulario datos usuario (en caso no logueado o editar)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    nro_celular: '',
    direccion: '',
  });

  // Formulario datos pago
  const [payment, setPayment] = useState({
    metodo: 'tarjeta', // o 'transferencia'
    tarjetaNumero: '',
    tarjetaVto: '',
    tarjetaCVV: '',
    transferenciaDetalle: '',
  });

  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Simulamos obtener usuario logueado con token
    // En realidad, llamar a backend o usar contexto/estado global
    
    const token = localStorage.getItem('token');
    if(token) {
      // Simular fetch datos usuario
      setTimeout(() => {
        // Ejemplo:
        setUser({
          nombre: 'Juan',
          apellido: 'Pérez',
          dni: '12345678',
          email: 'juan@mail.com',
          nro_celular: '123456789',
          direccion: 'Calle Falsa 123',
        });
        setForm({
          nombre: 'Juan',
          apellido: 'Pérez',
          dni: '12345678',
          email: 'juan@mail.com',
          nro_celular: '123456789',
          direccion: 'Calle Falsa 123',
        });
        setLoadingUser(false);
      }, 1000);
    } else {
      setLoadingUser(false);
    }
  }, []);

  const handleInputChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handlePaymentChange = (e) => {
    setPayment({...payment, [e.target.name]: e.target.value});
  };

  const handleMetodoChange = (metodo) => {
    setPayment({...payment, metodo});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesando(true);
    setMensaje('');

    // Validar datos mínimos, luego simular envío a backend
    // Aquí podrías enviar datos de usuario + pago + carrito

    setTimeout(() => {
      setProcesando(false);
      setMensaje('Compra realizada con éxito. Gracias por tu compra!');
      clearCart();
      // Opcional: redirigir a página de gracias o historial
      // navigate('/gracias');
    }, 2000);
  };

  if(loadingUser) return <p>Cargando datos...</p>;

  return (
    <div className="carrito-container">
      <h2>Checkout</h2>
      <div className="carrito-content">

        {/* Datos usuario */}
        <div className="order-summary" style={{flex: 2, minWidth: '400px'}}>
          <h3>Datos de Usuario</h3>
          <form onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleInputChange} required />

            <label>Apellido</label>
            <input name="apellido" value={form.apellido} onChange={handleInputChange} required />

            <label>DNI</label>
            <input name="dni" value={form.dni} onChange={handleInputChange} required />

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleInputChange} required />

            <label>Celular</label>
            <input name="nro_celular" value={form.nro_celular} onChange={handleInputChange} required />

            <label>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleInputChange} required />

            <h3>Método de Pago</h3>
            <div className="delivery-options" style={{marginBottom: '15px'}}>
              <button type="button" className={payment.metodo === 'tarjeta' ? 'delivery-selected' : ''} onClick={() => handleMetodoChange('tarjeta')}>
                Tarjeta Débito/Crédito
              </button>
              <button type="button" className={payment.metodo === 'transferencia' ? 'delivery-selected' : ''} onClick={() => handleMetodoChange('transferencia')}>
                Transferencia Bancaria
              </button>
            </div>

            {payment.metodo === 'tarjeta' ? (
              <>
                <label>Número de tarjeta</label>
                <input name="tarjetaNumero" value={payment.tarjetaNumero} onChange={handlePaymentChange} required={payment.metodo === 'tarjeta'} />

                <label>Vencimiento (MM/AA)</label>
                <input name="tarjetaVto" value={payment.tarjetaVto} onChange={handlePaymentChange} required={payment.metodo === 'tarjeta'} />

                <label>CVV</label>
                <input name="tarjetaCVV" value={payment.tarjetaCVV} onChange={handlePaymentChange} required={payment.metodo === 'tarjeta'} />
              </>
            ) : (
              <>
                <label>Detalle de transferencia</label>
                <textarea name="transferenciaDetalle" value={payment.transferenciaDetalle} onChange={handlePaymentChange} required={payment.metodo === 'transferencia'} />
              </>
            )}

            <button type="submit" className="checkout-btn" disabled={procesando}>
              {procesando ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </form>
          {mensaje && <p style={{color: 'green', marginTop: '10px'}}>{mensaje}</p>}
        </div>

        {/* Columna resumen del pedido (igual que en carrito) */}
        <div className="order-summary">
          <h3>Resumen del pedido</h3>

          <div>
            {cartItems.length > 0 ? cartItems.map(product => (
              <div key={product.id} style={{ display: 'flex', marginBottom: '10px', gap: '10px' }}>
                <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <strong>{product.name}</strong> <br />
                  Cantidad: {product.quantity} <br />
                  Precio: ${(product.priceOffer || product.price).toLocaleString()}
                </div>
              </div>
            )) : <p>Tu carrito está vacío</p>}
          </div>

          <div className="price-summary" style={{ marginTop: '20px' }}>
            <div className="line">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="line">
              <span>Descuentos:</span>
              <span>-${discount.toLocaleString()}</span>
            </div>
          </div>

          <div className="total" style={{ fontSize: '1.4rem', marginTop: '10px' }}>
            <strong>Total:</strong> ${total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
