import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Usuarios from '../pages/Usuarios';
import Productos from '../pages/Productos';
import Ventas from '../pages/Ventas';
import './AdminPanel.css';

function AdminPanel() {
  const [selectedSection, setSelectedSection] = useState('usuarios');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="admin-panel">
      <Sidebar 
        visible={sidebarVisible} 
        onSelect={setSelectedSection}
        selected={selectedSection}
      />

      <div className={`main-content ${sidebarVisible ? '' : 'sidebar-closed'}`}>
        <div className="hamburger" onClick={toggleSidebar}>☰</div>

        {selectedSection === 'usuarios' && <Usuarios />}
        {selectedSection === 'productos' && <Productos />}
        {selectedSection === 'ventas' && <Ventas />}
      </div>
    </div>
  );
}

export default AdminPanel;
