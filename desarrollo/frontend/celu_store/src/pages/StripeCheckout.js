// StripeForm.js
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

function StripeForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Acá enviarías paymentMethod.id a tu backend
      console.log('Método de pago creado:', paymentMethod);
      onSuccess(paymentMethod);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {/* <button type="submit" disabled={!stripe || processing} style={{ marginTop: 15 }}>
        {processing ? 'Procesando...' : 'Pagar'}
      </button> */}
    </form>
  );
}

export default StripeForm;
