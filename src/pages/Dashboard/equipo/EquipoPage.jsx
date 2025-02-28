import React, { useEffect, useState } from "react";
import { getAssociatedGroups, getTeamData, postTeam, deleteTeamAPI, postNotification, upDataTeamMembers } from "../../../api/api";
import Modal from "../../../components/Modal";
import Mensajes from "../../../components/Mensajes";
import WarningMessage from "../../../components/message/Warning";
import { useNavigate } from "react-router-dom";


function TeamPage() {
  const navigate = useNavigate();

  const [myRole, setMyRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [associatedGroups, setAssociatedGroups] = useState([]);
  const [showConfigUsModal, setShowConfigUsModal] = useState(false);

  const [teamDatoUsConfig, setTeamDatoUsConfig] = useState({
    user_name: "",
    user_email: "",
    user_role: "",
    team_id: ""
  });
  const [userTeamDelete, setUserTeamDelete] = useState({
    user_email: "",
    team_id: ""
  });

  const [teamData, setTeamData] = useState(null);
  const [sendSolicitud, setSendSolicitud] = useState({
    user_email: "",
    message: "",
    team_id: "",
    type: "invitation"
  });
  const [newRolMember, setNewRolMember] = useState("");
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    role: "",
  });

  useEffect(() => {
    const fetchAssociatedGroups = async () => {
      setLoading(true);
      try {
        const response = await getAssociatedGroups();
        if (response?.data && response.status == 200) {
          setAssociatedGroups(response?.data.result);
        } else {
          setAssociatedGroups([]);
        }
        if (response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin || response.data.error == "jwt expired") {
            sessionStorage.removeItem("token");
            navigate("/");
          } else {
            mostrarMensaje("error", response.data.message);
          }
        }

      } catch (error) {
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchAssociatedGroups();
  }, []);

  const fetchTeamData = async (id) => {
    setLoading(true)
    try {
      const response = await getTeamData(id);
      if (response?.data?.result) {
        setTeamData(response.data.result);
      } else {
        console.warn("No se encontraron datos en la respuesta del servidor.");
        setTeamData([]); // Evita errores asignando un array vacío si no hay datos
      }
      setShowMembersModal(true);
      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin || response.data.error == "jwt expired") {
          sessionStorage.removeItem("token");
          navigate("/");
        }
      }

    } catch (error) {
      console.error("Error al obtener los datos del equipo:");
    } finally {
      setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.description || !newTeam.role) {
      mostrarMensaje("error", "Debes completar todos los campos");
      return;
    }
    setLoading(true)

    try {
      const response = await postTeam(newTeam);
      const newTeamAssignId = {
        id: response.data.team_assign_id,
        name_team: newTeam.name,
        role: newTeam.role,
        team_id: response.data.team_id
      };


      setAssociatedGroups([...associatedGroups, newTeamAssignId]);
      setNewTeam({
        name: "",
        description: "",
        role: "",
      });

      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin || response.data.error == "jwt expired") {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          mostrarMensaje("error", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error al crear el equipo:");
    } finally {
      setLoading(false)
    }
  };

  const handleDeleteTeamConfirmed = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      await deleteTeamAPI({ user_email: selectedTeam.user_email, team_id: selectedTeam.team_id });
      ("Equipo eliminado");
      mostrarMensaje("exito", "Equipo eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el equipo:");
      mostrarMensaje("error", "Error al eliminar el equipo");
    } finally {
      setLoading(false);
      setShowWarning(false);
      setShowConfigUsModal(false);
      location.reload();
    }
  };



  //mensaje
  const [mensaje, setMensaje] = useState({
    tipo: "exito",
    mensaje: "",
  });
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, mensaje: texto });
    setTimeout(() => setMensaje({ tipo: "", mensaje: "" }), 3000);
  };
  //enviar solicitud
  const handleSendSolicitud = async (e) => {
    e.preventDefault();

    try {
      const response = await postNotification(sendSolicitud);

      if (response.status !== 200 && response.status !== 201) {
        if (response.data?.redirectToLogin || response.data.error == "jwt expired") {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          mostrarMensaje("error", response.data.message);
        }
      }

      if (response.status == 201) {
        mostrarMensaje("exito", "Solicitud Enviada con éxito");
      }

      setSendSolicitud(prevState => ({
        user_email: "",
        message: "",
        team_id: showAddMemberModal ? prevState.team_id : "",
        type: "invitation"
      }));
      
    } catch (error) {
      console.error("Error al enviar la solicitud:");
    }
  };


  //cambiar role

  const handleMenuClick = (e) => {
    setTeamDatoUsConfig({
      user_name: e.name,
      user_email: e.email_user,
      user_role: e.rol_user,
      team_id: e.team_id
    });

    setShowMembersModal(false)
    setShowConfigUsModal(true);
  };
  const handleEditRole = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await upDataTeamMembers(teamDatoUsConfig);

      if (response && response.status === 200) {
        mostrarMensaje("exito", response.data.message);
        setTimeout(() => {
          setShowConfigUsModal(false);
        }, 5000);
      } else if (response && response.data) {
        // Manejo de errores esperados
        if (response.data.redirectToLogin || response.data.error === "jwt expired") {
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          mostrarMensaje("error", response.data.message || "Error desconocido");
        }
      }

    } catch (error) {
      console.warn("Error en la actualización del rol"); // Solo log para depuración, luego puedes quitarlo
    } finally {
      setLoading(false);
    }
};


  //advertencia:
  const [showWarning, setShowWarning] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const confirmDeleteTeam = (teamData) => {
    setSelectedTeam(teamData);
    setShowWarning(true);
    setShowConfigUsModal(false)

  };


  return (
    <div className="p-6">

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}


      {/**modal para editar o eliminar usuario */}
      <Modal isOpen={showConfigUsModal} onClose={() => setShowConfigUsModal(false)}>

        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold mb-4">Editar o Eliminar</p>

          <div className="flex flex-col gap-4">
            <form onSubmit={handleEditRole} className="flex flex-col gap-4">
              <p>{teamDatoUsConfig.user_name}</p>
              <p>{teamDatoUsConfig.user_email}</p>
              <select value={teamDatoUsConfig.user_role} onChange={(e) => setTeamDatoUsConfig({ ...teamDatoUsConfig, user_role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="leader">Leader</option>
                <option value="member">Member</option>
              </select>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Guardar</button>
            </form>
          </div>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setShowMembersModal(true); setShowConfigUsModal(false) }}>Cancelar</button>
          <button onClick={() => confirmDeleteTeam(teamDatoUsConfig)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"> Eliminar Usuario Del Equipo</button>
          {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        </div>
      </Modal>
      {/* Modal para ver miembros */}
      <Modal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)}>
        <div>
          <h2 className="text-lg font-semibold mb-4">Miembros del Equipo</h2>
          {teamData?.members?.length > 0 ? (
            <ul>
              {teamData.members
                .sort((a, b) => (a.rol_user === "admin" ? -1 : 1))
                .map((member, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <div className="flex items-center mb-2  justify-between border border-gray-400 p-2 rounded ">

                      <div>
                        <p>{member.name}</p>
                        <p className="text-gray-600 text-sm">{member.email_user}</p>
                      </div>
                      <p className={`text-sm ${member.rol_user === "admin" ? "text-red-600 font-bold" : "text-green-600"}`}>
                        {member.rol_user}
                      </p>
                      {myRole === "admin" || myRole === "leader" ? (
                        <button className="text-red-600 focus:outline-none mr-2" onClick={() => handleMenuClick(member)}>
                          ⋮
                        </button>
                      ) : (
                        <p className="text-gray-600 text-sm">Rol: {member.rol_user}</p>
                      )}

                    </div>

                  </div>
                ))}
            </ul>
          ) : (
            <p>No hay miembros en este equipo.</p>
          )}
        </div>
      </Modal>



      {/* Modal para agregar miembros */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)}>
        <div>
          <form onSubmit={handleSendSolicitud} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Agregar Miembro</h2>
            <input
              type="email"
              name="email"
              value={sendSolicitud.user_email}
              onChange={(e) => setSendSolicitud({ ...sendSolicitud, user_email: e.target.value })}
              placeholder="Email del Miembro"
              className="border border-gray-400 p-2 rounded"
            />
            <input
              type="text"
              name="message"
              value={sendSolicitud.message}
              onChange={(e) => setSendSolicitud({ ...sendSolicitud, message: e.target.value })}
              placeholder="Mensaje de Invitación"
              className="border border-gray-400 p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600">
              Enviar Invitación
            </button>

          </form>
          {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        </div>
      </Modal>

      {/* Modal para crear equipo */}
      <Modal isOpen={showChangeRoleModal} onClose={() => setShowChangeRoleModal(false)}>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-lg shadow-md text-center mb-4 flex flex-col items-center justify-center h-full gap-4">
              <h2 className="text-lg font-semibold mb-4">Crear Equipo</h2>
              <input
                type="text"
                name="name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Ingresa el Nombre del Equipo"
                className="border border-gray-400 p-2 rounded"
              />
              <input
                name="description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                type="text"
                placeholder="Ingresa una Descripción"
                className="border border-gray-400 p-2 rounded"
              />
              <select
                className="border border-gray-400 p-2 rounded"
                onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                value={newTeam.role}
                name="role"
              >
                <option value="" disabled>Elija una opción:</option>
                <option value="admin">Admin</option>
                <option value="leader">Leader</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white font-bold px-4 py-2 rounded mt-4">
                Crear Equipo
              </button>
            </div>
          </form>
          {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        </div>
      </Modal>

      {/* Mis equipos */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mis Equipos</h1>
        <button
          className="bg-gray-800 text-white font-bold px-4 py-2 rounded"
          onClick={() => setShowChangeRoleModal(true)}
        >
          Crear Equipo
        </button>
      </div>

      <WarningMessage
        message="¿Estás seguro de que quieres eliminar este equipo? Esta acción no se puede deshacer."
        show={showWarning}
        onConfirm={handleDeleteTeamConfirmed}
        onCancel={() => setShowWarning(false)}
      />

      {/* Listado de equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {associatedGroups.length === 0 && <p>No tienes equipos asociados.</p>}
        {associatedGroups.map((group) => (
          <div key={group.id} className="bg-white p-6 rounded-lg shadow-md">

            {/**boton eliminar y nombre */}
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold">{group.name_team}</h2>
              <button
                onClick={() => confirmDeleteTeam(group)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar Usuario Del Equipo
              </button>

            </div>
            <p className="text-gray-600">Tú: {group.role}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => { fetchTeamData(group.team_id); setMyRole(group.role); }}
            >
              Ver Miembros
            </button>
            {(group.role === "admin" || group.role === "leader") && (
              <button
                className="bg-green-500 text-white font-bold px-4 py-2 rounded mt-4 ml-2"
                onClick={() => { setShowAddMemberModal(true); setSendSolicitud({ ...sendSolicitud, team_id: group.team_id }); ("data", group) }}
              >
                Agregar Miembros
              </button>
            )}
          </div>
        ))}
      </div>


    </div>
  );
}

export default TeamPage;
