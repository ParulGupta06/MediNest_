import axios from "axios";

const API = "https://medinest-t13z.onrender.com";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export async function getProfile() {
  const response = await axios.get(`${API}/profile`, getHeaders());
  return response.data;
}

export async function updateProfile(data) {
  const response = await axios.put(`${API}/profile`, data, getHeaders());
  return response.data;
}

export async function updatePassword(currentPassword, newPassword) {
  const response = await axios.put(
    `${API}/profile/password`,
    { currentPassword, newPassword },
    getHeaders()
  );
  return response.data;
}
