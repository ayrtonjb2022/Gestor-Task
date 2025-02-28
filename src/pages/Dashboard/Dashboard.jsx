import Sidebar from "../../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import InicioPage from "../Dashboard/inicio/InicioPage";
import MisTareas from "../Dashboard/tareas/MisTareas";
import TeamPage from "../Dashboard/equipo/EquipoPage";
import SettingsPage from "../Dashboard/configuraciones/ConfiguracionPage";
import NotificationsPage from "./notificacion/NotificacioPage";
import EquipoDataPage from "../Dashboard/equipo/EquipoData";

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Contenido Principal */}
      <div className="ml-64 w-full p-4">
        <Routes>
          <Route path="/" element={<InicioPage />} /> {/* /dashboard */}
          <Route path="/tasks" element={<MisTareas />} /> {/* /dashboard/tasks */}
          <Route path="/team" element={<TeamPage />} /> {/* /dashboard/team */}
          <Route path="/settings" element={<SettingsPage />} /> {/* /dashboard/settings */}
          <Route path="/notifications" element={<NotificationsPage />} /> {/* /dashboard/notifications */}
          <Route path="/team/:id" element={<EquipoDataPage />} /> {/* /dashboard/team/:id */}

        </Routes>


      </div>
    </div>
  );
};

export default DashboardPage;
