import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-6 border-b border-gray-800 bg-black text-white">
      <h1 className="text-2xl font-bold">
        Gestor<span className="text-blue-500">Tareas</span>
      </h1>

      {/* Botón menú hamburguesa en móviles */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menú de navegación */}
      <nav className={`${menuOpen ? "block" : "hidden"} md:flex md:space-x-6 absolute md:static top-16 left-0 w-full bg-black md:w-auto md:bg-transparent p-4 md:p-0`}>
        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-center">
          <li><a href="/" className="hover:text-blue-500">Inicio</a></li>
          <li>
            <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto" onClick={() => window.location.href = '/login'}>
              Iniciar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;