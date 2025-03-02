import React, { useState, useEffect } from "react";
import axios from "axios";
import Mensajes from "../../components/Mensajes";
import { useNavigate } from "react-router";

function LoginPage() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);


  const [mensaje, setMensaje] = useState({
    tipo: "exito",
    mensaje: "",
  });


  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, mensaje: texto });
    setTimeout(() => setMensaje({ tipo: "", mensaje: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { token, user } = response.data;
     


        // Guardar el token y el ID en sessionStorage
        sessionStorage.setItem("token", token);
        mostrarMensaje("exito", "Inicio de sesión exitoso");

        // Redirigir al dashboard
        if (token || sessionStorage.getItem("token")) {
          location.href = "/dashboard";
        }
      }
      

    } catch (error) {
      if (error.response && error.response.data) {
        (error.response)
        mostrarMensaje("error", error.response.data.message || error.response.data);
      } else {
        console.error("Error en la solicitud:");
        mostrarMensaje("error", "Error al iniciar sesión");
      }
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 onClick={() => navigate("/")} className="cursor-pointer text-2xl font-bold">
            Gestor<span className="text-blue-500">Tareas</span>
          </h1>
        </div>
      </header>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-16">

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        )}

        <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-center mb-8">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
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
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              />
            </div>
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
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              Iniciar Sesión
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              ¿No tienes cuenta?{" "}
              <a href="/registro" className="text-blue-500 hover:underline">
                Regístrate
              </a>
            </p>
          </div>
          {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        </div>
      </div>
    </>
  );
}

export default LoginPage;
