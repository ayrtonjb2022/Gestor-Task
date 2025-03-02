import React, { useState, useEffect } from "react";
import { getDataNotifications, acceptInvitationRequest } from "../../../api/api";
import { format, parse } from "@formkit/tempo"

import Mensajes from "../../../components/Mensajes";

function NotificationsPage() {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const response = await getDataNotifications();

        if (!Array.isArray(response.data)) {
          console.error("Estructura inesperada en la respuesta del backend");
          return;
        }

        const invitations = response.data.filter(n => n.type === "invitation");
        const assigned = response.data.filter(n => n.type === "task_assigned" && format(n.created_at) === format(new Date()));
        const pending = response.data.filter(n => n.type === "pending_task");

        setPendingInvitations(invitations);
        setAssignedTasks(assigned);
        setPendingTasks(pending);

        //manejo  de errores
        if (response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin) {
            sessionStorage.removeItem("token");
            navigate("/");
          } else {
            mostrarMensaje("error", response.data.message);
          }
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  //mensaje
  const [mensaje, setMensaje] = useState({
    tipo: "exito",
    mensaje: "",
  });
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, mensaje: texto });
    setTimeout(() => setMensaje({ tipo: "", mensaje: "" }), 3000);
  };

  const acceptInvitation = async (data) => {
    setLoading(true)
    try {
      const response = await acceptInvitationRequest({
        sender_id: data.inv.sender_id,
        notifications_id: data.inv.id,
        acept: data.acept
      });
      // Actualizar la lista de invitaciones pendientes
      setPendingInvitations(prevInvitations => prevInvitations.filter(inv => inv.id !== data.inv.id));

      //mensaje
      if (data.acept == false) {
        return mostrarMensaje("error", "Invitación rechazada");
      }
      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin) {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          mostrarMensaje("error", response.data.message);
        }
      }
      return mostrarMensaje("exito", "Invitación aceptada");

    } catch (error) {
      console.error("Error al aceptar la invitación:");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Invitaciones para unirse a equipos */}
      {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <div className="bg-white p-6 mb-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Invitaciones Pendientes</h2>
        {pendingInvitations.length === 0 ? (
          <p>No tienes invitaciones pendientes</p>
        ) : (
          pendingInvitations.map((inv, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
              <div className="">
                <p className="text-lg font-medium">{inv.message}</p>
                <p className="text-sm text-gray-600">Equipo: {inv.name_teams}</p>
                <p className="text-sm text-gray-600">Invitado: {format(inv.created_at, "full")}</p>

              </div>
              <div className="btn flex gap-2">
                <button onClick={() => acceptInvitation({ inv, acept: true })} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Aceptar</button>
                <button onClick={() => acceptInvitation({ inv, acept: false })} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Rechazar</button>
              </div>
            </div>

          ))
        )}
      </div>

      {/* Tareas Asignadas */}
      <div className="bg-white p-6 mb-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Tareas Asignadas Del Dìa</h2>
        {assignedTasks.length === 0 ? (
          <p>No tienes tareas asignadas</p>
        ) : (
          assignedTasks.map((task, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <p className="text-lg font-medium">{task.message}</p>
              <p className="text-sm text-gray-600">Equipo: {task.name_teams}</p>
              <p className="text-sm text-gray-600">{format(task.created_at, "full")}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default NotificationsPage;
