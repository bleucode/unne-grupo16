import React, { useState, useEffect } from 'react';
import './Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const fetchProductos = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos', err));
  };

  const fetchMarcas = () => {
    fetch('/api/products/marcas')
      .then(res => res.json())
      .then(data => setMarcas(data))
      .catch(err => console.error('Error al obtener marcas', err));
  };
  
  const fetchModelos = () => {
    fetch('/api/products/modelos')
      .then(res => res.json())
      .then(data => setModelos(data))
      .catch(err => console.error('Error al obtener modelos', err));
  };

  const fetchCategorias = () => {
    fetch('/api/products/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Error al obtener categorías', err));
  };

  useEffect(() => {
    fetchProductos();
    fetchMarcas();
    fetchModelos();
    fetchCategorias();
  }, []);

  const [search, setSearch] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const filteredProductos = productos.filter(prod =>
    `${prod.nombre} ${prod.categoria?.nombre || ''}`.toLowerCase().includes(search.toLowerCase())
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
      precio_descuento: '', 
      stock: '',
      imagen: '',
      estado: true,
      modelo: {
        id_modelo: null,
        descripcion: '',
        marca: {
          id_marca: null,
          nombre: ''
        }
      },
      categoria: {
        id_categoria: null,
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
        precio_descuento: Number(selectedProducto.precio_descuento) || 0,  
        stock: parseInt(selectedProducto.stock) || 0,
        imagen: selectedProducto.imagen || '',
        estado: selectedProducto.estado !== undefined ? selectedProducto.estado : true,
        id_modelo: Number(selectedProducto.id_modelo) || null,
        id_marca: Number(selectedProducto.id_marca) || null,
        id_categoria: Number(selectedProducto.id_categoria) || null,
      };

      const url = addMode
        ? '/api/products'
        : `/api/products/${selectedProducto.id_producto}`;

      const method = addMode ? 'POST' : 'PUT';

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al guardar el producto');

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE', headers });
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

              <label>Precio Descuento:</label> 
              <input
                type="number"
                value={selectedProducto.precio_descuento || ''}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, precio_descuento: parseFloat(e.target.value) })}
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
              <select
                value={selectedProducto.id_marca || ''}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, id_marca: Number(e.target.value) })}
                disabled={!editMode && !addMode}
              >
                <option value="">Seleccionar marca</option>
                {marcas.map(m => (
                  <option key={m.id_marca} value={m.id_marca}>
                    {m.nombre}
                  </option>
                ))}
              </select>

              <label>Modelo:</label>
              <select
                value={selectedProducto.id_modelo || ''}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, id_modelo: Number(e.target.value) })}
                disabled={!editMode && !addMode}
              >
                <option value="">Seleccionar modelo</option>
                {modelos.map(m => (
                  <option key={m.id_modelo} value={m.id_modelo}>
                    {m.descripcion}
                  </option>
                ))}
              </select>

              <label>Categoría:</label>
              <select
                value={selectedProducto.id_categoria || ''}
                onChange={(e) => setSelectedProducto({ ...selectedProducto, id_categoria: Number(e.target.value) })}
                disabled={!editMode && !addMode}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>


              {(editMode || addMode) && <button type="submit" className="save-btn">Guardar</button>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
