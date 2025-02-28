import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Registrar componentes para el gráfico
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InicioPage() {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    labels: [],
    datasets: [
      {
        label: "Efectividad de Tareas",
        data: [],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        borderRadius: 5,
      },
    ],
  });

  // Datos de la base
  const [gruposAsociados, setGruposAsociados] = useState([]);

  useEffect(() => {

    const fetchGruposAsociados = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/team/allTeam/`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        if (response.status !== 200 && response.status !== 201) {
          if (response.data?.redirectToLogin || response.data.error == "jwt expired") {
            sessionStorage.removeItem("token");
            navigate("/");
          } else {
            mostrarMensaje("error", response.data.message);
          }
        }
        setGruposAsociados(response.data.result);
      } catch (error) {
        console.error("Error fetching grupos:");
        return navigate("/login");
      }
    };

    const fetchTask = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/tasks/`,{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        
        const labels = [];
        const data = [0, 0, 0]; // Completadas, En Progreso, Pendientes

        // Recorriendo los datos de las tareas
        response.data.forEach((task) => {
          labels.push(task.title);
          if (task.status === "completed") {
            data[0] += 1; // Completadas
          } else if (task.status === "in_progress") {
            data[1] += 1; // En Progreso
          } else if (task.status === "pending") {
            data[2] += 1; // Pendientes
          }
        });

        setTaskData({
          labels: labels,
          datasets: [
            {
              label: "Efectividad de Tareas",
              data: data,
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        return navigate("/login");
      }
    };

    fetchGruposAsociados();
    fetchTask();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Efectividad de Tareas" },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Sección de Grupos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Grupos Asociados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gruposAsociados.map((grupo) => (
            <Link
              key={grupo.id}
              to={`/dashboard/team/${grupo.team_id}`}
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{grupo.name_team}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección de Gráfico */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Progreso de Tareas</h2>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <Bar data={taskData} options={options} />
        </div>
      </section>
    </div>
  );
}

export default InicioPage;
