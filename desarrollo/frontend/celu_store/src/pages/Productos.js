import React, { useState } from 'react';
import './Productos.css';

function Productos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Laptop', categoria: 'Electrónica', precio: 1500, stock: 10 },
    { id: 2, nombre: 'Mouse', categoria: 'Accesorios', precio: 25, stock: 100 },
    { id: 3, nombre: 'Monitor', categoria: 'Electrónica', precio: 300, stock: 20 },
  ]);

  const [search, setSearch] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const filteredProductos = productos.filter(prod =>
    `${prod.nombre} ${prod.categoria}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (prod) => {
    setSelectedProducto(prod);
    setEditMode(false);
    setAddMode(false);
  };

  const handleEdit = (prod) => {
    setSelectedProducto({ ...prod });
    setEditMode(true);
    setAddMode(false);
  };

  const handleAdd = () => {
    setSelectedProducto({ nombre: '', categoria: '', precio: '', stock: '' });
    setAddMode(true);
    setEditMode(false);
  };

  const handleDelete = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (addMode) {
      const newProd = { ...selectedProducto, id: Date.now() };
      setProductos([...productos, newProd]);
    } else {
      setProductos(productos.map(p => (p.id === selectedProducto.id ? selectedProducto : p)));
    }
    closeModal();
  };

  const closeModal = () => {
    setSelectedProducto(null);
    setEditMode(false);
    setAddMode(false);
  };

  return (
    <div className="productos-container">
      <h1>Gestión de Productos</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
        <button className="agregar-btn" onClick={handleAdd}>+ Agregar producto</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.categoria}</td>
              <td>${prod.precio}</td>
              <td>{prod.stock}</td>
              <td>
                <button onClick={() => handleView(prod)}>Ver</button>
                <button onClick={() => handleEdit(prod)}>Modificar</button>
                <button onClick={() => handleDelete(prod.id)}>Dar de baja</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProducto && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{addMode ? 'Agregar Producto' : editMode ? 'Modificar Producto' : 'Ver Producto'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <label>Nombre:</label>
              <input
                type="text"
                value={selectedProducto.nombre}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, nombre: e.target.value })}
                disabled={!editMode && !addMode}
              />
              <label>Categoría:</label>
              <input
                type="text"
                value={selectedProducto.categoria}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, categoria: e.target.value })}
                disabled={!editMode && !addMode}
              />
              <label>Precio:</label>
              <input
                type="number"
                value={selectedProducto.precio}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, precio: parseFloat(e.target.value) })}
                disabled={!editMode && !addMode}
              />
              <label>Stock:</label>
              <input
                type="number"
                value={selectedProducto.stock}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, stock: parseInt(e.target.value) })}
                disabled={!editMode && !addMode}
              />
              {(editMode || addMode) && <button type="submit" className="save-btn">Guardar</button>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
