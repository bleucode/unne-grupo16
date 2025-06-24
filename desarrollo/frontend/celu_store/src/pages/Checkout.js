import React, { useState, useEffect } from 'react';
import '../pages/Checkout.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from '../pages/StripeCheckout.js';

const stripePromise = loadStripe('pk_test_TU_PUBLIC_KEY_DE_STRIPE'); // poné tu clave pública de prueba


function Checkout({  clearCart }) {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = {};

      await Promise.all(cartItems.map(async (item) => {
        try {
          const res = await axios.get(`http://localhost:4000/api/products/${item.id}`);
          details[item.id] = res.data;
        } catch (err) {
          console.error(`Error al obtener producto ${item.id}`, err);
        }
      }));

      setProductDetails(details);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => {
    const product = productDetails[item.id];
    const price = product?.precio_descuento ?? product?.precio ?? item.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const totalSinDescuento = cartItems.reduce((acc, item) => {
    const product = productDetails[item.id];
    const price = product?.precio ?? item.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const totalDescuento = totalSinDescuento - subtotal;
  const total = subtotal;

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
  const [metodosPago, setMetodosPago] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState(null);
  const [selectedCuotaId, setSelectedCuotaId] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
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

        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }

        const data = await response.json();

        setUser(data);
        setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            dni: data.dni || '',
            email: data.email || '',
            nro_celular: data.nro_celular || '',
            calle: data.calle || '',
            nro: data.nro_calle || '',
            id_direccion: data.id_direccion || ''
        });
        } catch (error) {
        console.error('Error al obtener usuario:', error);
        } finally {
        setLoadingUser(false);
        }
    };

    fetchUserData();
    }, []);

  useEffect(() => {
    const fetchOpcionesPago = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ventas/opcionesPago');
        const data = await response.json();

        // Acceder correctamente a cada parte del objeto
        setMetodosPago(data.metodosPago);
        setCuotas(data.cuotas);
      } catch (error) {
        console.error('Error al cargar opciones de pago:', error);
      }
    };

    fetchOpcionesPago();
  }, []);

  const handleInputChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handlePaymentChange = (e) => {
    setPayment({...payment, [e.target.name]: e.target.value});
  };

  const handleMetodoChange = (metodo) => {
    const cuotasMetodo = cuotas.filter(c => c.id_metodo_pago === metodo.id_metodo_pago);
    const metodoPagoString = metodo.nombre.toLowerCase().includes('tarjeta') ? 'tarjeta' : metodo.nombre.toLowerCase();

    setSelectedMetodoPago(metodo);
    setPayment({
        ...payment,
        metodo: metodoPagoString,
        idMetodoPago: metodo.id_metodo_pago,
        cuotasDisponibles: cuotasMetodo,
        tipoTarjeta: ''  // reseteamos tipoTarjeta al cambiar método
      });

    setSelectedCuotaId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setMensaje('');

    const token = localStorage.getItem('token');
    if (!token) {
      setProcesando(false);
      setMensaje('Debes estar logueado para realizar la compra.');
      return;
    }

    if (!user?.id || !payment.idMetodoPago || !form.id_direccion) {
      setProcesando(false);
      setMensaje('Faltan datos requeridos para completar la compra.');
      return;
    }

    const payload = {
      clienteId: user.id,
      idMetodoPago: payment.idMetodoPago,
      direccionEnvioId: form.id_direccion,
      items: cartItems.map(item => ({
        productoId: item.id,
        cantidad: item.quantity
      })),
      total,
      detalleTransferencia: payment.metodo === 'transferencia' ? payment.transferenciaDetalle : undefined
    };


    try {
      const response = await fetch('http://localhost:4000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al procesar la compra');
      }

      setMensaje('Compra realizada con éxito. Gracias por tu compra!');
      clearCart();
      navigate(`/factura/${data.id_venta}`);
    } catch (error) {
      setMensaje('Ocurrió un error al procesar la compra.');
      setErrorMsg(error.message || 'Hubo un error desconocido.');
      setShowErrorModal(true);
    } finally {
      setProcesando(false);
    }
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
                <input type="text" id="nro" value={form.nro} name="nro" />
                </div>
            </div>
            <input type="hidden" name="id_direccion" value={form.id_direccion} />

            <h3>Método de Pago</h3>
            
            <div className="delivery-options" style={{marginBottom: '15px'}}>
            {metodosPago.map(metodo => {
              const nombreMostrar = metodo.nombre === 'Tarjeta de crédito Stripe'
                ? 'Tarjeta de crédito'
                : metodo.nombre === 'Tarjeta de débito Stripe'
                ? 'Tarjeta de débito'
                : metodo.nombre;

              return (
                <button
                  key={metodo.id}
                  type="button"
                  className={selectedMetodoPago?.id === metodo.id ? 'delivery-selected' : ''}
                  onClick={() => handleMetodoChange(metodo)}
                >
                  {nombreMostrar}
                </button>
              );
            })}
          </div>

          {payment.metodo === 'tarjeta' && (
            <>
              <label>Tipo de tarjeta</label>
              <select name="tipoTarjeta" value={payment.tipoTarjeta || ''} onChange={handlePaymentChange} required>
                <option value="">Seleccioná una opción</option>
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
              </select>

              <Elements stripe={stripePromise}>
                <StripeForm
                  amount={total}
                  onSuccess={(paymentMethod) => {
                    setMensaje('Pago realizado con Stripe (modo prueba).');
                    clearCart();
                  }}
                  metadata={{
                    metodo: selectedMetodoPago?.nombre,
                    tipo: payment.tipoTarjeta,
                    usuarioEmail: form.email,
                    nombreCompleto: `${form.nombre} ${form.apellido}`,
                    idMetodoPago: selectedMetodoPago?.id_metodo_pago,
                    direccionEnvioId: form.id_direccion,
                    cuotaId: selectedCuotaId,
                    items: JSON.stringify(cartItems.map(item => ({
                      id: item.id,
                      cantidad: item.quantity
                    }))),
                    clienteId: user?.id
                  }}
                />

                {/* Mostrar cuotas sólo si tipoTarjeta es crédito */}
                {payment.tipoTarjeta === 'credito' && cuotas.length > 0 && (
                  <div>
                    <label>Seleccioná cantidad de cuotas</label>
                    <select
                    value={selectedCuotaId}
                    onChange={(e) => setSelectedCuotaId(e.target.value)}
                    required
                  >
                    <option value="">Elegí una opción</option>
                    {cuotas
                      .filter(cuota => cuota.id_metodo_pago === selectedMetodoPago?.id_metodo_pago)
                      .map(cuota => (
                        <option key={cuota.id_cuota} value={cuota.id_cuota}>
                          {cuota.numero_cuota} cuotas - {cuota.interes_cuota}% interés
                        </option>
                      ))
                    }
                  </select>
                  </div>
                )}
              </Elements>
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
              <span>-${totalDescuento.toLocaleString()}</span>
            </div>
          </div>

          <div className="total" style={{ fontSize: '1.4rem', marginTop: '10px' }}>
            <strong>Total:</strong> ${total.toLocaleString()}
          </div>
        </div>
      </div>
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Error en la compra</h3>
            <p>{errorMsg}</p>
            <button onClick={() => setShowErrorModal(false)}>Cerrar</button>
          </div>
        </div>
      )}


    </div>
    
  );
}

export default Checkout;
