import React from "react";
import { AlertTriangle } from "lucide-react";

const WarningMessage = ({ message, show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-yellow-500 bg-yellow-100 text-yellow-800 rounded-lg shadow-md max-w-sm mx-auto">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-700" />
        <span className="font-medium">{message}</span>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        >
          Sí, eliminar
        </button>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400"
        >
          No, cancelar
        </button>
      </div>
    </div>
  );
};

export default WarningMessage;
