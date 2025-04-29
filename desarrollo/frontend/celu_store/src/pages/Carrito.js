import React from 'react';
import '../pages/Carrito.css';

function Carrito({ cartItems, clearCart }) {
  const discount = 40000;
  
  const subtotal = cartItems.reduce((acc, product) => 
    acc + ((product.priceOffer || product.price) * product.quantity), 0
  );
  const total = subtotal - discount;

  const handleCheckout = () => {
    alert('¡Compra confirmada!');
    clearCart();
  };

  return (
    <div className="carrito-container">
      <h2>Mi Carrito</h2>
      <div className="carrito-content">
        
        {/* Productos */}
        <div className="cart-items">
          {cartItems.length > 0 ? cartItems.map(product => (
            <div key={product.id} className="cart-item">
              <img src={product.image} alt={product.name} className="item-image" />
              <div className="item-details">
                <h3>{product.name}</h3>
                <div className="item-prices">
                  {product.priceOriginal && (
                    <span className="original-price">${product.priceOriginal.toLocaleString()}</span>
                  )}
                  <span className="offer-price">
                    ${(product.priceOffer || product.price).toLocaleString()}
                  </span>
                </div>
                <div className="item-quantity">
                  <label>Cantidad:</label>
                  <input type="number" value={product.quantity} min="1" readOnly />
                </div>
              </div>
            </div>
          )) : (
            <p className="empty-cart">Tu carrito está vacío</p>
          )}

          {/* Botón de vaciar carrito */}
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-btn">Vaciar Carrito</button>
          )}
        </div>

        {/* Resumen */}
        <div className="order-summary">
          <h3>Resumen del pedido</h3>

          <div className="delivery-options">
            <button className="delivery-selected">Envío</button>
            <button>Retiro</button>
          </div>

          <div className="price-summary">
            <div className="line">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="line">
              <span>Descuentos:</span>
              <span>-${discount.toLocaleString()}</span>
            </div>
          </div>

          <div className="coupon">
            <input 
              type="text" 
              placeholder="Ingresá tu código" 
            />
            <button>Agregar</button>
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
