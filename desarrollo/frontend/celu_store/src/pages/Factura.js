import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Factura.css';

const Factura = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/ventas/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener la venta');
        return res.json();
      })
      .then(data => setVenta(data))
      .catch(error => {
        console.error('Error al cargar la factura:', error);
        setVenta(null);
      });
  }, [id]);

  const handleDownloadPDF = () => {
    const printContent = document.getElementById('factura').innerHTML;
    const ventana = window.open('', '', 'height=700,width=700');
    ventana.document.write('<html><head><title>Factura</title></head><body>');
    ventana.document.write(printContent);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.print();
  };

  if (!venta) return <p>Cargando factura...</p>;

  return (
    <div className="factura-wrapper">
      <div className="factura-container" id="factura">
        <h1 className="factura-title">Comprobante</h1>

        <div className="factura-header">
          <div>
            <p><strong>Cliente:</strong> {venta.usuario?.nombre} {venta.usuario?.apellido}</p>
            <p><strong>Email:</strong> {venta.usuario?.email}</p>
          </div>
          <div>
            <p><strong>Fecha:</strong> {new Date(venta.fecha_venta).toLocaleString()}</p>
            <p><strong>ID de venta:</strong> #{venta.id_venta}</p>
          </div>
        </div>

        <div className="factura-info">
          <p><strong>Método de pago:</strong> {venta.metodoPago?.nombre}</p>
          <p><strong>Total:</strong> ${venta.total_venta}</p>
          <p><strong>Estado de envío:</strong> {venta.envio?.estado_envio}</p>
          <p><strong>Código de seguimiento:</strong> {venta.envio?.cod_seguimiento ?? 'Aún no asignado'}</p>
        </div>

        <h2 className="productos-title">Productos adquiridos</h2>
        <table className="productos-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
            </tr>
          </thead>
          <tbody>
            {venta.ventaDetalles?.map((item, index) => (
              <tr key={index}>
                <td>{item.producto.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.producto.precio_descuento}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="envio-mensaje">
          Recibirás un email con el código de seguimiento cuando el pedido sea enviado. ¡Gracias por tu compra!
        </p>
      </div>

      <button className="btn-descargar" onClick={handleDownloadPDF}>Descargar PDF</button>
    </div>
  );
};

export default Factura;
