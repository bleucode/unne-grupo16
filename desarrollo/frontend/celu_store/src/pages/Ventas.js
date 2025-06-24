import React, { useState, useEffect } from 'react';
import './Ventas.css';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem('token');

  // Traer ventas del backend
  const fetchVentas = () => {
    fetch('http://localhost:4000/api/ventas', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error('Error al obtener ventas', err));
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Filtrar ventas por búsqueda
  const filteredVentas = ventas.filter(venta =>
    `${venta.cliente?.nombre || ''} ${venta.cod_seguimiento || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  // Ver detalles de la venta
  const handleView = (venta) => {
    setSelectedVenta(venta);
    setEditMode(false);
  };

  // Entrar en modo edición para código de seguimiento y estado de envío
  const handleEdit = (venta) => {
    setSelectedVenta({
      ...venta,
      codigo_seguimiento: venta.envio.cod_seguimiento || '', // para el input (nombre amigable)
      estado_envio: venta.envio.estado_envio || 'Pendiente',
    });
    setEditMode(true);
  };

  // Guardar código de seguimiento y estado actualizado
  const handleSave = async () => {
    try {
      const payload = {
        cod_seguimiento: selectedVenta.codigo_seguimiento || '', // clave que espera backend
        estado_envio: selectedVenta.estado_envio || 'Pendiente',
      };

      const response = await fetch(`http://localhost:4000/api/envios/${selectedVenta.id_venta}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Error al actualizar la venta');

      await fetchVentas(); 
      setEditMode(false);
    } catch (error) {
      console.error('Error guardando venta:', error);
    }
  };

  const closeModal = () => {
    setSelectedVenta(null);
    setEditMode(false);
  };

  return (
    <div className="ventas-container">
      <h1>Gestión de Ventas</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por cliente o código de seguimiento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <table className="ventas-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Código Seguimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredVentas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
              <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
              <td>${venta.ventaDetalles[0]?.precio ?? 'N/A'}</td>
              <td>{venta.envio?.cod_seguimiento || 'Sin asignar'}</td>
              <td>{venta.envio?.estado_envio || 'Sin asignar'}</td>
              <td>
                <button onClick={() => handleView(venta)}>Ver</button>
                <button onClick={() => handleEdit(venta)}>Asignar Código</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVenta && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{editMode ? 'Asignar Código de Seguimiento' : 'Detalle de Venta'}</h2>

            <div>
              <p><strong>ID Venta:</strong> {selectedVenta.id_venta}</p>
              <p><strong>Cliente:</strong> {selectedVenta.usuario ? `${selectedVenta.usuario.nombre} ${selectedVenta.usuario.apellido}` : 'Sin cliente'}</p>
              <p><strong>Fecha:</strong> {new Date(selectedVenta.fecha_venta).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${selectedVenta.ventaDetalles[0]?.precio}</p>
              

              {editMode ? (
                <>
                  <label>Código de Seguimiento:</label>
                  <input
                    type="text"
                    value={selectedVenta.codigo_seguimiento}
                    onChange={(e) => setSelectedVenta({ ...selectedVenta, codigo_seguimiento: e.target.value })}
                    required
                  />

                  <label>Estado del Envío:</label>
                  <select
                    value={selectedVenta.estado_envio}
                    onChange={(e) => setSelectedVenta({ ...selectedVenta, estado_envio: e.target.value })}
                    required
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En camino">En camino</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>

                  <button onClick={handleSave} className="save-btn">Guardar</button>
                </>
              ) : (
                <>
                  <p><strong>Código de Seguimiento:</strong> {selectedVenta.codigo_seguimiento || '-'}</p>
                  <p><strong>Estado del Envío:</strong> {selectedVenta.estado_envio || '-'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;
