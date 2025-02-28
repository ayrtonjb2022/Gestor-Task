import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUsers, FaCog, FaSignOutAlt, FaBell, FaBars, FaTimes } from "react-icons/fa"; 
import { useNavigate } from "react-router";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú en móviles

  const delleteToken = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Botón de menú para móviles */}
      <button 
        className="md:hidden fixed top-4 left-4 text-white bg-gray-800 p-2 rounded-full z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`w-64 h-screen bg-gray-800 text-white flex flex-col fixed top-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:flex`}
      >
        <h2 className="text-2xl font-semibold text-center py-6 border-b border-gray-700">
          GestorTareas
        </h2>
        <ul className="flex-1 space-y-4 mt-6 px-4">
          <li>
            <Link to="/dashboard/" className="block hover:text-blue-400">
              <FaHome className="inline-block mr-2" />
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/dashboard/tasks" className="block hover:text-blue-400">
              <FaTasks className="inline-block mr-2" />
              Mis Tareas
            </Link>
          </li>
          <li>
            <Link to="/dashboard/team" className="block hover:text-blue-400">
              <FaUsers className="inline-block mr-2" />
              Equipo
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings" className="block hover:text-blue-400">
              <FaCog className="inline-block mr-2" />
              Configuración
            </Link>
          </li>
          <li>
            <Link to="/dashboard/notifications" className="block hover:text-blue-400">
              <FaBell className="inline-block mr-2" />
              Notificaciones
            </Link>
          </li>
        </ul>

        {/* Botón de Cerrar Sesión */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded" onClick={delleteToken}>
            <FaSignOutAlt className="inline-block mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Fondo oscuro cuando el menú está abierto en móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
