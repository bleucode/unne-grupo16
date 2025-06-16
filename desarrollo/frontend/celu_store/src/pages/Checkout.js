import React, { useState, useEffect } from 'react';
import '../pages/Checkout.css'; // Para mantener la misma estética
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from '../pages/StripeCheckout.js'; // o '../components/StripeForm' según la carpeta

const stripePromise = loadStripe('pk_test_TU_PUBLIC_KEY_DE_STRIPE'); // poné tu clave pública de prueba


function Checkout({  clearCart }) {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
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
    calle: '',
    nro_calle: ''
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
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        console.log('Token guardado en localStorage:', localStorage.getItem('token'));
        if (!token) {
        setLoadingUser(false);
        return;
        }

        try {
        const response = await fetch('http://localhost:4000/api/user/me', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }

        const data = await response.json();

        setUser(data);
        console.log('Datos del usuario:', data);
        setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            dni: data.dni || '',
            email: data.email || '',
            nro_celular: data.nro_celular || '',
            calle: data.calle || '',
            nro: data.nro_calle || ''
        });
        } catch (error) {
        console.error('Error al obtener usuario:', error);
        } finally {
        setLoadingUser(false);
        }
    };

    fetchUserData();
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
            <div className="address-group">
                <div className="field">
                <label htmlFor="calle">Calle</label>
                <input type="text" id="calle" value={form.calle} name="calle" />
                </div>
                <div className="field">
                <label htmlFor="nro">Nro</label>
                <input type="text" id="nro" value={form.nro_calle} name="nro" />
                </div>
            </div>

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
                <Elements stripe={stripePromise}>
                <StripeForm amount={total} onSuccess={(paymentMethod) => {
                    setMensaje('Pago realizado con Stripe (modo prueba).');
                    clearCart();
                    console.log('Pago exitoso', paymentMethod);
                }} />
                </Elements>
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
