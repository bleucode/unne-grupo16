import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/Carrito.css';

function Carrito({ cartItems: initialCartItems, clearCart }) {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({});
  const [cartItems, setCartItems] = useState(initialCartItems);

  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

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

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, parseInt(newQuantity) || 1) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = productDetails[item.id];
    const price = product?.precio_descuento ?? product?.precio ?? item.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const totalSinDescuento = cartItems.reduce((acc, item) => {
    const product = productDetails[item.id];
    const original = product?.precio ?? item.price ?? 0;
    return acc + original * item.quantity;
  }, 0);

  const totalDescuento = totalSinDescuento - subtotal;
  const total = subtotal;

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  return (
    <div className="carrito-container">
      <h2>Mi Carrito</h2>
      <div className="carrito-content">

        <div className="cart-items">
          {cartItems.length > 0 ? cartItems.map(product => {
            const detail = productDetails[product.id];
            const precio = detail?.precio ?? product.price;
            const precioDescuento = detail?.precio_descuento;
            return (
              <div key={product.id} className="cart-item">
                <img src={product.image} alt={product.name} className="item-image" />
                <div className="item-details">
                  <h3>{detail?.nombre || product.name}</h3>
                  <div className="item-prices">
                    {precioDescuento && precioDescuento < precio ? (
                      <>
                        <span className="original-price">${precio.toLocaleString()}</span>
                        <span className="offer-price">${precioDescuento.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="offer-price">${precio.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="item-quantity">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={e => handleQuantityChange(product.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="empty-cart">Tu carrito está vacío</p>
          )}

          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-btn">Vaciar Carrito</button>
          )}
        </div>

        <div className="order-summary">
          <h3>Resumen del pedido</h3>
          <div className="price-summary">
            <div className="line">
              <span>Subtotal:</span>
              <span>${totalSinDescuento.toLocaleString()}</span>
            </div>
            <div className="line">
              <span>Descuentos:</span>
              <span>- ${totalDescuento.toLocaleString()}</span>
            </div>
          </div>
          <div className="total">
            <strong>Total:</strong> ${total.toLocaleString()}
          </div>

          <button onClick={handleCheckout} className="checkout-btn">Finalizar compra</button>
          <button className="continue-shopping">Seguir comprando</button>
        </div>

      </div>
    </div>
  );
}

export default Carrito;
