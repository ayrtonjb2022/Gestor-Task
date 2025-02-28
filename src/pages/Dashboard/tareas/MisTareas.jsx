import React, { useEffect, useState } from "react";
import { getDataTask, upDataTaks, deleteTask, getAssociatedGroups, postDataTask } from "../../../api/api";
import Mensajes from "../../../components/Mensajes";
import Modal from "../../../components/Modal";

import { useNavigate } from "react-router-dom";
function MisTareas() {
    const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    user_id: "",
    team_id: "",
    name: "",
  });
  const [teamAssociatedY, setTeamAssociated] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskATomar, setTasksATomar] = useState({})
  //mensaje
  //mensaje
  const [mensaje, setMensaje] = useState({
    tipo: "exito",
    mensaje: "",
  });
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, mensaje: texto });
    setTimeout(() => setMensaje({ tipo: "", mensaje: "" }), 3000);
  };

  const [newCall, setNewCall] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {

      try {
        const response = await getDataTask();
        
        if (response?.status == 200) {
          setTasks(response.data);
        }else{
          setTasks([])
        }

        if(response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin) {
            sessionStorage.removeItem("token");
            navigate("/");
          }else if(response.status !== 401){
            mostrarMensaje("error", response.data.message);
          }
        }
      } catch (error) {
        console.error("Error al obtener las tareas:");
      }
    };

    const teamAssociated = async () => {
      

      try {
        const response = await getAssociatedGroups();
        
        if (response?.data && response.status == 200) {
          setTeamAssociated(response.data.result);
        } else {
          setTeamAssociated([])
        }
        if(response.status !== 200 && response.status !== 201) {
          if(response.data?.redirectToLogin || response.status == 401) {
            sessionStorage.removeItem("token");
            navigate("/");
          }else{
            mostrarMensaje("error", response.data.message);
          }
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchTasks();
    teamAssociated();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    const taskToSend = {
      ...newTask,
    };

    try {
      if (!taskToSend.title || !taskToSend.description || !taskToSend.team_id) {
        return mostrarMensaje("error", "Debes completar todos los campos para poder agregar una tarea");
      }
      const response = await postDataTask(taskToSend);

      if (response?.data?.id_task) {
        const newTaskWithId = { ...taskToSend, id_tasks: response.data.id_task, status: "pending" };

        setTasks((prevTasks) => [...prevTasks, newTaskWithId]);

        if(response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin) {
            sessionStorage.removeItem("token");
            navigate("/");
          }else{
            mostrarMensaje("error", response.data.message);
          }
        }
      } else {
        console.error("No se pudo obtener el ID de la nueva tarea.");
      }

      setNewTask({
        title: "",
        description: "",
        user_id: "",
        team_id: "",
      });

    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toggleTask = async (id_tasks, infoTask) => {
    try {


      if (infoTask.status == "pending") {
        setTasksATomar(infoTask)
        setShowTaskModal(true)
      }
      // Obtener la tarea a modificar
      const taskToUpdate = tasks.find((task) => task.id_tasks === id_tasks);
      if (!taskToUpdate) {
        console.error("No se encontró la tarea con ID:", id_tasks);
        return;
      }



      // Determinar el nuevo estado
      let newStatus = "pending";
      if (taskToUpdate.status === "pending") newStatus = "in_progress";
      else if (taskToUpdate.status === "in_progress") newStatus = "completed";

      // Llamar a la API y esperar la actualización
      const response = await upDataTaks({ id_tasks, status: newStatus });

      if (response?.data?.message) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id_tasks === id_tasks ? { ...task, status: newStatus } : task
          )
        );
        
        if(response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin) {
            sessionStorage.removeItem("token");
            navigate("/");
          }else{
            mostrarMensaje("error", response.data.message);
          }
        }

      } else {
        console.error("Error al actualizar la tarea en la API:");
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:");
    }
  };

  const deleteTaskHandler = (id_tasks) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id_tasks !== id_tasks));

    // Llamar a la API para eliminar la tarea
    deleteTask(id_tasks);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
          <p className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Descripción de Tu Tarea
          </p>

          <div className="flex flex-col gap-3 text-gray-700">
            {taskATomar.name != "" && (
                <p><span className="font-semibold">Equipo:</span> {taskATomar.name}</p>
            )}
            <p><span className="font-semibold">Título:</span> {taskATomar.title}</p>
            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg 
              max-h-40 overflow-y-auto scrollbar-thin 
              scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {taskATomar.description}
            </p>

          </div>

          <button
            className="mt-6 w-full bg-green-500 text-white font-semibold py-2 rounded-lg 
                 hover:bg-green-600 transition duration-300"
            onClick={() => setShowTaskModal(false)}
          >
            OK
          </button>
        </div>
      </Modal>

      <h2 className="text-2xl font-bold mb-4">Mis Tareas</h2>

      <form onSubmit={addTask}>
        <div className="mb-6 flex gap-2">
          <input
            name="title"
            type="text"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Titulo Tarea..."
            className="p-2 border border-gray-300 rounded w-full"
          />
          <input
            name="description"
            type="text"
            value={newTask.description}
            onChange={handleChange}
            placeholder="Descripcion..."
            className="p-2 border border-gray-300 rounded w-full"
          />
          <select
            className="p-2 border border-gray-300 rounded w-full"
            onChange={handleChange}
            name="team_id"
            value={newTask.team_id} >
            <option disabled value="">Equipos asociados</option>
            {teamAssociatedY.map((team, index) => (
              <option key={index} value={team.team_id}>{team.name_team}</option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>

      </form>
      <ul className="space-y-4">
        {/* Mostrar tareas no completadas */}
        {tasks.filter(task => task.status !== "completed").map((task, index) => (
          <li
            key={index}
            className={`p-4 flex justify-between items-center rounded-md shadow-md ${task.status === "completed" ? "bg-green-100" : "bg-white"
              } `}
          >
            <span className={task.status === "completed" ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                {task.status}
              </p>
              {task.name && (
                <span className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  {task.name}
                </span>
              )}
            </div>
            {task.status !== "completed" && (
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task.id_tasks, task)}
                  className={`px-3 py-1 rounded ${task.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                >
                  {task.status === "pending" ? "Tomar Tarea" : "Completado"}
                </button>
                <button
                  onClick={() => deleteTaskHandler(task.id_tasks)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}

        {/* Mostrar tareas completadas */}
        {tasks.filter(task => task.status === "completed").map((task, index) => (
          <li
            key={index}
            className="p-4 flex justify-between items-center rounded-md shadow-md bg-green-100"
          >
            <span className="line-through text-gray-500">{task.title}</span>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Completadas
              </p>
            </div>
          </li>
        ))}
      </ul>
      {mensaje.mensaje && <Mensajes tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

    </div>
  );
}

export default MisTareas;
