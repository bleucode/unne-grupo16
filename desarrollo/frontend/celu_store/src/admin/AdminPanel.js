import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <--- importamos
import Sidebar from './Sidebar';
import Usuarios from '../pages/Usuarios';
import Productos from '../pages/Productos';
import Ventas from '../pages/Ventas';
import './AdminPanel.css';

function AdminPanel() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('section') || 'usuarios';

  const [selectedSection, setSelectedSection] = useState(initialSection);
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
