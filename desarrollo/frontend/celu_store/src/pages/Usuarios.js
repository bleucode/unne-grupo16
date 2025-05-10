import React, { useState, useEffect } from 'react';
import './Usuarios.css'; 

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Efecto para cargar los usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token no proporcionado');
          return;
        }

        // Obtener los usuarios
        const response = await fetch('http://localhost:4000/api/user/allusers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        // Ahora, para cada usuario, también buscamos la dirección por su id
        const transformedUsers = await Promise.all(data.map(async (user) => {
          const addressResponse = await fetch(`http://localhost:4000/api/user/address/${user.id_direccion}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          const addressData = await addressResponse.json();
          return {
            id: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            dni: user.dni,
            nro_celular: user.nro_celular,
            direccion: addressData || {}, // Traemos los datos completos de la dirección
            rol: user.id_rol === 1 ? 'usuario' : 'administrador',
          };
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    `${user.nombre} ${user.apellido} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  // Función para eliminar usuario
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no proporcionado');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/user/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        console.log('Usuario eliminado');
      } else {
        console.error('Error al eliminar el usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }

    setShowConfirmModal(false);  // Cerrar el modal de confirmación
    setUserToDelete(null);  // Resetear el usuario a eliminar
  };

  // Mostrar el modal de confirmación antes de eliminar
  const confirmDelete = (user) => {
    setUserToDelete(user); // Establecer el usuario que se eliminará
    setShowConfirmModal(true); // Mostrar el modal de confirmación
  };

  // Cancelar la eliminación y cerrar el modal
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setEditMode(false);
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no proporcionado');
        return;
      }
  
      const response = await fetch(`http://localhost:4000/api/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: selectedUser.nombre,
          apellido: selectedUser.apellido,
          email: selectedUser.email,
          dni: selectedUser.dni,
          nro_celular: selectedUser.nro_celular,
          id_rol: selectedUser.rol === 'usuario' ? 1 : 2,
          direccion: {
            id_direccion: selectedUser.direccion?.id_direccion,
            calle: selectedUser.direccion?.calle,
            nro_calle: selectedUser.direccion?.nro_calle,
            cod_postal: selectedUser.direccion?.cod_postal,
            id_localidad: selectedUser.direccion?.id_localidad,
          },
        }),
      });


      const responseData = await response.json();

      if (response.ok) {
        setUsers(users.map(u => (u.id === selectedUser.id ? selectedUser : u)));
        setSelectedUser(null);
        setEditMode(false);
        alert(responseData.message || "Usuario actualizado con éxito");
        console.log('Usuario actualizado');
      } else {
        console.error('Error al actualizar el usuario:', response.statusText);
        alert(responseData.message || "Hubo un error al actualizar el usuario");
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert("Error de conexión. Intenta nuevamente.");
    }
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
              <td>{user.rol}</td>
              <td>
                <button onClick={() => handleView(user)}>Ver</button>
                <button onClick={() => handleEdit(user)}>Modificar</button>
                <button onClick={() => confirmDelete(user)}>Dar de baja</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={cancelDelete}>&times;</span>
            <h2>¿Estás seguro de que deseas eliminar este usuario?</h2>
            <p>{userToDelete?.nombre} {userToDelete?.apellido}</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={handleDeleteUser}>Sí, eliminar</button>
              <button className="modal-btn cancel" onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de edición de usuario */}
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
              <label>DNI:</label>
              <input
                type="text"
                value={selectedUser.dni}
                onChange={(e) => setSelectedUser({ ...selectedUser, dni: e.target.value })}
                disabled={!editMode}
                placeholder="DNI"
              />
              <label>Nro Celular:</label>
              <input
                type="text"
                value={selectedUser.nro_celular}
                onChange={(e) => setSelectedUser({ ...selectedUser, nro_celular: e.target.value })}
                disabled={!editMode}
                placeholder="Número de celular"
              />
              <label>Rol:</label>
              <select
                value={selectedUser.rol}
                onChange={(e) => setSelectedUser({ ...selectedUser, rol: e.target.value })}
                disabled={!editMode}
              >
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
              <label>Calle:</label>
              <input
                type="text"
                value={selectedUser.direccion.calle}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  direccion: { ...selectedUser.direccion, calle: e.target.value },
                })}
                disabled={!editMode}
                placeholder="Calle"
              />
              <label>Nro Calle:</label>
              <input
                type="text"
                value={selectedUser.direccion.nro_calle}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  direccion: { ...selectedUser.direccion, nro_calle: e.target.value },
                })}
                disabled={!editMode}
                placeholder="Número"
              />
              <label>Cod postal:</label>
              <input
                type="text"
                value={selectedUser.direccion.cod_postal}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  direccion: { ...selectedUser.direccion, cod_postal: e.target.value },
                })}
                disabled={!editMode}
                placeholder="Código Postal"
              />
              {editMode && <button className="modal-btn confirm" type="submit">Guardar cambios</button>}
            </form>
            <button className="modal-btn cancel" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Usuarios;
