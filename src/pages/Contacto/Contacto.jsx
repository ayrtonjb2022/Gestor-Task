import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import FooterPage from "../../components/Footer";
import NavBar from "../../components/NavBar";
function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado correctamente.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (

    <div className="bg-gray-900 text-white py-0">
      <NavBar />
      <div className="container mx-auto px-8">
      
        <h2 className="text-3xl font-semibold text-center mb-12">Contáctanos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">¿Tienes alguna pregunta?</h3>
            <p className="text-gray-400 mb-8">
              Estamos aquí para ayudarte. Si tienes dudas sobre el uso de nuestra plataforma, no dudes en contactarnos. ¡Estamos listos para responder a todas tus preguntas!
            </p>
            <div className="flex justify-center md:justify-start space-x-8">
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-blue-500 text-2xl" />
                <p>+34 123 456 789</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-500 text-2xl" />
                <p>contacto@gestortareas.com</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-500 text-2xl" />
                <p>Calle Ejemplo, 123, Ciudad</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <div className="mb-4">
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

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
      <FooterPage />
    </div>
  );
}

export default ContactPage;
