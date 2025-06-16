import React, { useState, useEffect } from 'react';
import './Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);

  const fetchProductos = () => {
    fetch('http://localhost:4000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos', err));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const [search, setSearch] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const filteredProductos = productos.filter(prod =>
    `${prod.nombre} ${prod.categoria.nombre}`.toLowerCase().includes(search.toLowerCase())
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
    setSelectedProducto({
      nombre: '',
      descripcion: '',
      especificacion: '',
      precio: '',
      stock: '',
      imagen: '',
      estado: true,
      modelo: {
        descripcion: '',
        marca: {
          descripcion: ''
        }
      },
      categoria: {
        nombre: ''
      }
    });
    setAddMode(true);
    setEditMode(false);
  };



  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      const payload = {
        nombre: selectedProducto.nombre || '',
        descripcion: selectedProducto.descripcion || '',
        especificacion: selectedProducto.especificacion || '',
        precio: Number(selectedProducto.precio) || 0,
        stock: parseInt(selectedProducto.stock) || 0,
        imagen: selectedProducto.imagen || '',
        estado: selectedProducto.estado !== undefined ? selectedProducto.estado : true,
        modelo: selectedProducto.modelo?.descripcion && selectedProducto.modelo?.marca?.descripcion
        ? {
            descripcion: selectedProducto.modelo.descripcion,
            marca: {
              descripcion: selectedProducto.modelo.marca.descripcion,
            },
          }
        : undefined,
        categoria: { nombre: selectedProducto.categoria?.nombre || 'Default Categoria' }
      };

      const url = addMode
        ? 'http://localhost:4000/api/productos'
        : `http://localhost:4000/api/productos/${selectedProducto.id_producto}`;

      const method = addMode ? 'POST' : 'PUT';
      
      const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const response = await fetch(url, {
        method,
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el producto');
      }

      const savedProduct = await response.json();
      if (addMode) {
        setProductos([...productos, savedProduct]);
      } else {
        setProductos(productos.map(p => (p.id_producto === savedProduct.id_producto ? savedProduct : p)));
      }

      closeModal();

    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };


  // Eliminar producto
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;
    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, { method: 'DELETE', headers });
      setProductos(productos.filter(p => p.id_producto !== id));
    } catch (error) {
      console.error('Error eliminando producto', error);
    }
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
            <tr key={prod.id_producto}>
              <td>{prod.nombre}</td>
              <td>{prod.categoria?.nombre || 'Sin categoría'}</td>
              <td>${prod.precio}</td>
              <td>{prod.stock}</td>
              <td>
                <button onClick={() => handleView(prod)}>Ver</button>
                <button onClick={() => handleEdit(prod)}>Modificar</button>
                <button onClick={() => handleDelete(prod.id_producto)}>Dar de baja</button>
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
                required
              />
              <label>Precio:</label>
              <input
                type="number"
                value={selectedProducto.precio}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, precio: parseFloat(e.target.value) })}
                disabled={!editMode && !addMode}
                required
              />
              <label>Stock:</label>
              <input
                type="number"
                value={selectedProducto.stock}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, stock: parseInt(e.target.value) })}
                disabled={!editMode && !addMode}
                required
              />
              <label>Marca:</label>
              <input
                type="text"
                value={selectedProducto.modelo?.marca?.descripcion || ''}
                onChange={(e) => setSelectedProducto({
                  ...selectedProducto,
                  modelo: {
                    ...(selectedProducto.modelo || {}),
                    marca: { descripcion: e.target.value }
                  }
                })}
              />

              <label>Modelo:</label>
              <input
                type="text"
                value={selectedProducto.modelo?.descripcion || ''}
                onChange={(e) => setSelectedProducto({
                  ...selectedProducto,
                  modelo: {
                    ...(selectedProducto.modelo || {}),
                    descripcion: e.target.value,
                    marca: selectedProducto.modelo?.marca || {}
                  }
                })}
              />

              <label>Categoría:</label>
              <input
                type="text"
                value={selectedProducto.categoria?.nombre || ''}
                onChange={(e) => setSelectedProducto({
                  ...selectedProducto,
                  categoria: { nombre: e.target.value }
                })}
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
