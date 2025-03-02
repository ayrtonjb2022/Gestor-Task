import React, { useEffect, useState } from "react";
import { getTeamData, postDataTask, postNotification } from "../../../api/api";
import { useNavigate } from "react-router-dom";

const EquipoDataPage = () => {
  const navigate = useNavigate();

  const idEquipo = window.location.href.split("/").pop();
  const [user_email, setUserEmail] = useState("");
  const [teamData, setTeamData] = useState(null);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState({}); // Estado separado para cada miembro
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchEquipo = async () => {
      setLoading(true)
      try {
        const response = await getTeamData(idEquipo);
        ("data", response);
        if (response?.data?.result) {
          setTeamData(response.data.result);
          setUserEmail(response.data.you);
        } else {
          console.warn("No se encontraron datos en la respuesta del servidor.");
          setTeamData([]); // Evita errores asignando un array vacío si no hay datos
        }
        if (response.status !== 200 || response.status !== 201) {
          if (response.data?.redirectToLogin) {
            sessionStorage.removeItem("token");
            navigate("/");
          }
        }
      } catch (error) {
        (error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipo();
  }, [idEquipo]);

  if (!teamData) return <div>Cargando...</div>;
  (teamData);

  const filteredMembers = teamData.members.filter((member) => member.email_user !== user_email); //en el backend debo traer todos menos el mio para si poder ir sacando los id y evitar eata filtracion
  const dataUser = teamData.members.filter((member) => member.email_user == user_email);
  (filteredMembers);

  const searchedMembers = filteredMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignTask = async (member_email) => {
    const task = tasks[member_email];
    if (!task?.title || !task?.description) {
      alert("Por favor, completa todos los campos de la tarea.");
      return;
    }
    setLoading(true);
    try {
      await postDataTask({
        title: task.title,
        description: task.description,
        user_email: member_email,
        team_id: idEquipo, // Agregado para asegurar la relación con el equipo
      });

      await postNotification({
        user_email: member_email,
        message: `Tarea: Titulo: "${task.title}" Descripcion: "${task.description}" asignada a ti `,
        team_id: idEquipo,
        type: "task_assigned"
      });

      // Actualizar el estado para incluir la nueva tarea
      setTeamData((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.email_user === member_email
            ? { ...m, tasks: [...m.tasks, { title: task.title, status: "pending" }] }
            : m
        ),
      }));

      setTasks((prev) => ({
        ...prev,
        [member_email]: { title: "", description: "" }, // Limpiar tarea después de asignarla
      }));
    } catch (error) {
      console.error("Error al asignar tarea:", error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Miembros del equipo: {teamData.team_name || "Equipo no encontrado"}</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar miembro..."
        className="w-full p-2 border rounded-md mb-6"
      />

      {searchedMembers.length > 0 ? (
        searchedMembers.map((member, index) => (
          <div key={index} className="bg-white p-6 mb-8 rounded-lg shadow-md flex">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">{member.name}</h2>

              {dataUser[0].rol_user == "admin" || dataUser[0].rol_user == "leader" ? (
                <div >
                  <label className="block font-medium">Asignar Tarea:</label>
                  <input
                    type="text"
                    value={tasks[member.email_user]?.title || ""}
                    placeholder="Título"
                    className="w-full p-2 border rounded-md mt-1"
                    onChange={(e) =>
                      setTasks((prev) => ({
                        ...prev,
                        [member.email_user]: { ...prev[member.email_user], title: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="text"
                    value={tasks[member.email_user]?.description || ""}
                    placeholder="Describe la tarea"
                    className="w-full p-2 border rounded-md mt-1"
                    onChange={(e) =>
                      setTasks((prev) => ({
                        ...prev,
                        [member.email_user]: { ...prev[member.email_user], description: e.target.value },
                      }))
                    }
                  />
                  <button
                    onClick={() => handleAssignTask(member.email_user)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Asignar Tarea
                  </button>
                </div>
              ) : null}
            </div>
            <div className="ml-6 w-60 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <h3 className="font-medium mb-4">Tareas:</h3>
              <ul className="space-y-3">
                {member.tasks.length > 0 ? (
                  member.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center">
                      <input type="checkbox" disabled className="mr-5" checked={task.status === "completed"} />
                      <span
                        className={`flex-1 ${task.status === "completed" ? "line-through text-green-500" : "text-red-500"}`}
                      >
                        {task.title}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No hay tareas asignadas.</p>
                )}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No se encontraron miembros.</p>
      )}
    </div>
  );
};

export default EquipoDataPage;
