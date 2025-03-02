import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaClock, FaShieldAlt, FaRocket, FaStar, FaHeart } from 'react-icons/fa';
import FooterPage from '../../components/Footer';
import NavBar from '../../components/NavBar';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRedirect = () => {
    if (isAuthenticated || sessionStorage.getItem("token")) {
      location.href = "/dashboard";  // ✅ Si está autenticado, ir al dashboard
    } else {
      location.href = "/login";  // ❌ Si no, ir al login
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <NavBar />

      <section className="flex flex-col items-center text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Organiza, Colabora y Alcanza tus Metas</h2>
        <p className="text-gray-400 max-w-xl mb-6">
          Optimiza el trabajo en equipo con una herramienta diseñada para la productividad.
          Facilita la gestión de tareas, comunicación fluida y organización eficiente.
        </p>
        <button onClick={handleRedirect} className="bg-blue-500 px-6 py-3 rounded text-lg hover:bg-blue-600">
          ¡Empieza Gratis!
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-16 border-t border-gray-800" id="caranteristica">
        <div className="text-center flex flex-col items-center">
          <FaUsers className="text-blue-500 text-4xl mb-2" />
          <h3 className="text-xl font-semibold mb-2">Colaboración en Tiempo Real</h3>
          <p className="text-gray-400">Trabaja en equipo sin interrupciones, todo sincronizado al instante.</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaClock className="text-blue-500 text-4xl mb-2" />
          <h3 className="text-xl font-semibold mb-2">Interfaz Intuitiva</h3>
          <p className="text-gray-400">Una experiencia de usuario simple y efectiva para todos.</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaShieldAlt className="text-blue-500 text-4xl mb-2" />
          <h3 className="text-xl font-semibold mb-2">Acceso Seguro</h3>
          <p className="text-gray-400">Protege tus datos con autenticación segura.</p>
        </div>
      </section>

      <section className="bg-gray-900 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">¿Por qué elegir GestorTareas?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaRocket className="text-blue-500 text-4xl mb-2" />
            <h3 className="text-xl font-semibold mb-2">Productividad Acelerada</h3>
            <p className="text-gray-400">Optimiza tu flujo de trabajo y alcanza tus objetivos más rápido.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaStar className="text-blue-500 text-4xl mb-2" />
            <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
            <p className="text-gray-400">Cada característica está pensada para ofrecerte la mejor experiencia.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaHeart className="text-blue-500 text-4xl mb-2" />
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-400">Estamos aquí para ayudarte en cada paso del camino.</p>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
};

export default HomePage;
