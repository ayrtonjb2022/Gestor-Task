import React, { useEffect, useState } from "react";
import axios from "axios";
import Mensajes from "../../components/Mensajes";
import { Routes, useNavigate } from "react-router"

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const [mensaje, setMensaje] = useState({
      tipo: "exito",
      mensaje: "",
    });
  
    const mostrarMensaje = (tipo, texto) => {
      setMensaje({ tipo, mensaje: texto });
      setTimeout(() => setMensaje({ tipo: "", mensaje: "" }), 3000); // Ocultar el mensaje después de 3 segundos
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {

        mostrarMensaje("advertencia", "Las contraseñas no coinciden");
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/auth/register`, formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        mostrarMensaje("exito", "Inicio de sesión exitoso");
        navigate("/login");
      }

      setFormData({name: "", email: "", password: "", confirmPassword: "" });
      
    } catch (error) {
      // Manejo de errores
      if (error.response && error.response.data) {
        mostrarMensaje("error", error.response.data.message || "Error al iniciar sesión");
       
      } else {
        console.error("Error en la solicitud:", error);
        mostrarMensaje("error", "Error al iniciar sesión");
       
      }
    }
  };

  const handleHomeRedirect = () => {
    navigate("/"); // Redirigir a la ruta de inicio
  };
  

 
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Encabezado */}

      <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Nombre a la izquierda */}
        <h1 onClick={handleHomeRedirect} className="cursor-pointer text-2xl font-bold">Gestor<span className="text-blue-500">Tareas</span></h1>
      </div>
    </header>

      {/* Contenido Principal */}
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-center mb-8">Regístrate</h2>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrarse
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Inicia sesión
              </a>
            </p>
          </div>
          {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        </div>
      </div>

      
    </div>
  );
}

export default RegisterPage;
