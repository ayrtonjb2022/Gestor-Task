import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); 
      window.location.href = "/login"; 
    }

    // 🔴 Evita que Axios imprima errores en la consola automáticamente
    return Promise.reject({ ...error, silent: true });
  }
);

export const getTeamData = async (id_team) => {
  try {
    const response = await api.get(`${API_URL}/team/allTeam/dst/${id_team}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Cambiado a sessionStorage
      },
    });
    return response; // Devuelve la respuesta correcta en caso de éxito
  } catch (error) {
    // Si el error tiene una respuesta del servidor, la devolvemos
    if (error.response) {
      return error.response; // Devuelve error.response en lugar de error
    }

    // Si no hay response, lanzamos un error genérico
    throw new Error("Error al obtener datos del equipo");
  }
};

export const getAssociatedGroups = async () => {
  try {
    const response = await api.get(`${API_URL}/team/allTeam/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Cambiado a sessionStorage
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDatoUser = async () => {
  try {
    const response = await api.get(`${API_URL}/user/data`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDataTask = async () => {
  try {
    const response = await api.get(`${API_URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response;
  } catch (error) {
    return error.response;
  }
};



export const getDataNotifications = async () => {//notificaciones

  try {
    const response = await api.get(`${API_URL}/notificaciones/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response;
  } catch (error) {
    return error.response;
  }
};

///post
export const postDataTask = async (data) => {
  try {
    
    const response = await api.post(`${API_URL}/tasks`, data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    
    return response;
  } catch (error) {
    return error.response;
  }
}


export const postTeam = async (data) => {
  try {
    const response = await api.post(`${API_URL}/team/create`, data,{
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response
  } catch (error) {
    return error.response;
  }
}

export const postNotification = async (data) => {
  try {
    
    const response = await api.post(`${API_URL}/notificaciones`, data,{
      headers:{
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    });    
  
    return response
  } catch (error) {
    return error.response;
  }
}
 
export const acceptInvitationRequest = async (data) => {
  try {
    const response = await api.post(`${API_URL}/invitations/accept/`, data,{
      headers:{
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    });

    return response
  } catch (error) {
    return error.response;
  }
}


//put
export const upDataTaks = async (data) => {
  const { id_tasks, status } = data;
  try {
    const response = await api.put(`${API_URL}/task/updata`, {
      id_tasks, 
      status,  
    },{ headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }}
  );

    return response;
  } catch (error) {
    return error.response; 
  }     
};


export const upDataTeamMembers = async (data) => {
  try {
    const response = await api.put(`${API_URL}/team/update`, data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    });
   
    
    return response; // Si la respuesta es exitosa, se retorna normalmente.
  } catch (error) {
    if(error.response){
      console.warn("Error al actualizar");
    }
    return error.response;
  }
};

export const upDataUser = async (data) => {
  try { 
    const response = await api.put(`${API_URL}/user/update`, data,{
      headers:{
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      }
    });
    ("api", response);

    if(response.status == 200 && response.data.success == true){
      //remover token
      sessionStorage.removeItem("token");
      //añadir nuevo token
      sessionStorage.setItem("token", response.data.newToken);
      
    }
    return response
  } catch (error) {
    return error.response;     
  }
}
export const upDataPassword = async (data) => {
  try {
    const response = await api.put(`${API_URL}/user/updateP`, data,{ 
      headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }});

    (response);
    
    return response

  } catch (error) {
    return error.response;
  }
}
//delete
export const deleteTask = async (id_task) => {
  try {    
    const response = await api.delete(`${API_URL}/task/delete/${id_task}`,{
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }});
    return response
  } catch (error) {
    return error.response;
  }

}

export const deleteTeamAPI = async (data) => {
  try {
    (data);
    const response = await api.delete(`${API_URL}/team/delete`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      data: data // 👈 Enviar los datos dentro de la propiedad 'data'
    });

    return response.data;
  } catch (error) {
    return error.response
  }

}


