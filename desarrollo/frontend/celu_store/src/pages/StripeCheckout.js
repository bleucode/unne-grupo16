import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

function StripeForm({ amount, metadata, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cuotas, setCuotas] = useState([]);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [esCredito, setEsCredito] = useState(null);
  const [mostrandoCuotas, setMostrandoCuotas] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  // const handleCrearMetodoPago = async () => {
  //   const cardElement = elements.getElement(CardElement);

  //   const { paymentMethod, error } = await stripe.createPaymentMethod({
  //     type: 'card',
  //     card: cardElement,
  //     billing_details: {
  //       name: metadata?.nombreCompleto,
  //       email: metadata?.usuarioEmail,
  //     },
  //   });

  //   if (error) {
  //     console.error('Error creando método de pago:', error);
  //     return;
  //   }

  //   // Stripe indica si es crédito o débito en paymentMethod.card.funding
  //   const tipo = paymentMethod.card.funding; // 'credit' | 'debit' | 'prepaid' | 'unknown'
  //   setEsCredito(tipo === 'credit');
  //   setPaymentMethodId(paymentMethod.id);

  //   if (tipo === 'credit') {
  //     setCuotas([
  //       { id: 1, label: `1 pago de $${amount / 100}` },
  //       { id: 3, label: `3 cuotas de $${Math.ceil(amount / 3 / 100)}` },
  //       { id: 6, label: `6 cuotas de $${Math.ceil(amount / 6 / 100)}` },
  //     ]);
  //     setMostrandoCuotas(true);
  //   } else {
  //     setCuotas([]);
  //     setCuotaSeleccionada(null);
  //     setMostrandoCuotas(false);
  //   }
  // };

  // const handlePagar = async () => {
  //   if (!paymentMethodId) {
  //     alert("Primero debés ingresar la tarjeta y validar el método de pago.");
  //     return;
  //   }

  //   const response = await fetch('http://localhost:4000/api/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       amount,
  //       currency: 'usd',
  //       metadata: {
  //         ...metadata,
  //         cuotaId: esCredito ? cuotaSeleccionada : null,
  //       },
  //     }),
  //   });

  //   const result = await response.json();
  //   if (!result.clientSecret) {
  //     alert('Error obteniendo clientSecret');
  //     return;
  //   }

  //   const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
  //     payment_method: paymentMethodId,
  //   });

  //   if (confirmError) {
  //     console.error('Error al confirmar el pago:', confirmError);
  //     return;
  //   }

  //   if (paymentIntent.status === 'succeeded') {
  //     onSuccess(paymentIntent);
  //   }
  // };
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '18px',
        color: '#32325d',
        letterSpacing: '0.05em',
        fontFamily: 'monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '20px',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <br />
      <label>Ingresá los datos de tu tarjeta:</label>
      <CardElement options={CARD_ELEMENT_OPTIONS} />

      {/* <button type="button" onClick={handleCrearMetodoPago}>
        Validar tarjeta
      </button> */}

      {mostrandoCuotas && (
        <>
          <label>Seleccioná cuotas (solo con tarjeta de crédito):</label>
          <select value={cuotaSeleccionada ?? ''} onChange={(e) => setCuotaSeleccionada(Number(e.target.value))}>
            <option value="">-- Elige una opción --</option>
            {cuotas.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </>
      )}

      <br /><br />
      {/* <button type="button" onClick={handlePagar} disabled={!paymentMethodId}>
        Pagar
      </button> */}
    </form>
  );
}

export default StripeForm;
