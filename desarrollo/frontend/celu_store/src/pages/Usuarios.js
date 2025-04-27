import React, { useState } from 'react';
import './Usuarios.css'; // agregamos estilos personalizados

function Usuarios() {
  const [users, setUsers] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', role: 'usuario' },
    { id: 2, nombre: 'Ana', apellido: 'Gómez', email: 'ana@example.com', role: 'administrador' },
    { id: 3, nombre: 'Luis', apellido: 'Martínez', email: 'luis@example.com', role: 'usuario' },
  ]);

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const filteredUsers = users.filter(user =>
    `${user.nombre} ${user.apellido} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setEditMode(false);
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setEditMode(true);
  };

  const handleSave = () => {
    setUsers(users.map(u => (u.id === selectedUser.id ? selectedUser : u)));
    setSelectedUser(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setEditMode(false);
  };

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleView(user)}>Ver</button>
                <button onClick={() => handleEdit(user)}>Modificar</button>
                <button onClick={() => handleDeleteUser(user.id)}>Dar de baja</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{editMode ? 'Modificar Usuario' : 'Información del Usuario'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <label>Nombre:</label>
              <input
                type="text"
                value={selectedUser.nombre}
                onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                disabled={!editMode}
              />
              <label>Apellido:</label>
              <input
                type="text"
                value={selectedUser.apellido}
                onChange={(e) => setSelectedUser({ ...selectedUser, apellido: e.target.value })}
                disabled={!editMode}
              />
              <label>Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                disabled={!editMode}
              />
              <label>Rol:</label>
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                disabled={!editMode}
              >
                <option value="usuario">usuario</option>
                <option value="administrador">administrador</option>
              </select>
              {editMode && <button type="submit" className="save-btn">Guardar</button>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
