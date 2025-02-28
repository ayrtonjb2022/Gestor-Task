import React from "react";

function Mensajes({ tipo, mensaje, onClose }) {
  // Define los estilos de acuerdo al tipo de mensaje
  const estilos = {
    exito: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    informacion: "bg-blue-100 border-blue-500 text-blue-700",
    advertencia: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div
      className={`flex items-center justify-between border-l-4 p-4 rounded-md mb-4 ${estilos[tipo]}`}
      role="alert"
    >
      <span className="flex-1">{mensaje}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xl font-bold ml-4 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Mensajes;
