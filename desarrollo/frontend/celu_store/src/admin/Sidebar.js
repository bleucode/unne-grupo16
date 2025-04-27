import React from 'react';
import './AdminPanel.css'; // o Sidebar.css si lo dividís

function Sidebar({ visible, onSelect, selected }) {
  return (
    <div className={`sidebar ${visible ? 'show' : ''}`}>
      <h2>Admin Panel</h2>
      <ul>
        <li
          onClick={() => onSelect('usuarios')}
          className={selected === 'usuarios' ? 'active' : ''}
        >
          Usuarios
        </li>

        <li
          onClick={() => onSelect('productos')}
          className={selected === 'productos' ? 'active' : ''}
        >
          Productos
        </li>
        {selected === 'productos' }

        <li
          onClick={() => onSelect('ventas')}
          className={selected === 'ventas' ? 'active' : ''}
        >
          Ventas
        </li>
        {selected === 'ventas'}
      </ul>
    </div>
  );
}

export default Sidebar;
