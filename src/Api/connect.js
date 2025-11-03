import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

export async function registerUser(formData) {
  const response = await axios.post("api/admin/auth/register", formData);
  return response.data;
}

export async function loginUser(formData) {
      
  const response = await axios.post("api/admin/auth/login", formData);
  
  return response.data;
}


export const fetchUserData = async () => {
  try {
    const token = await localStorage.getItem("token");
    const response = await axios.get("api/admin/auth/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    console.log('here');
    
    const token = await localStorage.getItem("token");
    const response = await axios.get("api/admin/auth/getallusers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    
    return response.data.users;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`/api/admin/auth/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('wait', res.data);
    return res.data; // ✅ return data directly
  } catch (err) {
    console.error("Error in fetchUserById:", err.response?.data || err.message);
    throw err;
  }
};


export const markOfflinePayment = async (id) => {
   const token = await localStorage.getItem("token");
  const res = await axios.post(`api/admin/auth/${id}/offline-payment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  if (!res.ok) throw new Error("Failed to mark offline payment");
  return res.json();
};
