import React, { useEffect, useState } from "react";
import { getDatoUser, upDataUser, upDataPassword } from "../../../api/api";
import Mensajes from "../../../components/Mensajes";
import { useNavigate } from "react-router-dom";


function SettingsPage() {
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getDatoUser();
        setUserInfo(response.data);
        if (response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin || response.status == 401) {
            sessionStorage.removeItem("token");
            navigate("/");
          } else {
            mostrarMensaje("error", response.data.message);
          }
        }
      } catch (error) {
        return navigate("/")

      }
    };

    fetchUserInfo();
  }, []);

  //mensaje
  const [mensaje, setMensaje] = useState({
    tipo: "exito",
    mensaje: "",
  });
  const [mensajeUpDato, setMensajeUpDato] = useState(false)
  const [mensajeUpDatoPass, setMensajeUpDatoPass] = useState(false)
  const mostrarMensaje = (tipo, texto, tipoMensaje) => {
    setMensaje({ tipo, mensaje: texto });
  
    if (tipoMensaje === "user") {
      setMensajeUpDato(true);
      setMensajeUpDatoPass(false);
    } else if (tipoMensaje === "password") {
      setMensajeUpDatoPass(true);
      setMensajeUpDato(false);
    }
  
    setTimeout(() => {
      if (tipoMensaje === "user") {
        setMensajeUpDato(false);
      } else if (tipoMensaje === "password") {
        setMensajeUpDatoPass(false);
      }
      setMensaje({ tipo: "", mensaje: "" });
    }, 3000);
  };
  

  const updateUserInfo = async () => {
    try {
      const response = await upDataUser(userInfo)
      setMensajeUpDato(true)
      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin || response.status == 401) {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          return mostrarMensaje("error", response.data.message, "user");
        }
      }
      mostrarMensaje("exito", response.data.message, "user");

    } catch (error) {
      if (error.response.status == 500) {
        return mostrarMensaje("error", "Error al actualizar el usuario intentelo mas tarde", "user");
      }

    }
  };

  const changePassword = async () => {
    try {
      setMensajeUpDatoPass(true)

      if (newPassword !== confirmPassword) {
        mostrarMensaje("error", "Las contraseñas no coinciden","password");
        return;
      }
      if (!newPassword || !confirmPassword || !currentPassword) {
        mostrarMensaje("error", "Todos los campos son obligatorios","password");
        return
      }

      const response = await upDataPassword({ newPassword: newPassword, password: currentPassword });
      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin || response.status == 401) {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          mostrarMensaje("error", response.data.message, "password");
        }
      }
      mostrarMensaje("exito", response.data.message,"password");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      return mostrarMensaje("error", "Error al actualizar el usuario intentelo mas tarde","password");
    }
  };



  if (!userInfo) return <p>Cargando...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">



      <div className="bg-white p-6 mb-8 rounded-lg shadow-md">
        {mensajeUpDato && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={userInfo.name || ""}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="p-3 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={userInfo.email || ""}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="p-3 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={updateUserInfo}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Actualizar Información
          </button>


        </div>
      </div>

      <div className="bg-white p-6 mb-8 rounded-lg shadow-md">
        {mensajeUpDatoPass && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña Actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full"
          />
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full"
          />
          <input
            type="password"
            placeholder="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full"
          />
          <button
            onClick={changePassword}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>


    </div>
  );
}

export default SettingsPage;
