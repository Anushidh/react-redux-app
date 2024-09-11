import axiosInstance from "../../utils/axios";

const API_URL = "/admin";

const adminLogin = async (adminData) => {
  const response = await axiosInstance.post(API_URL + "/adminlogin", adminData);
  // console.log(response.data);
  if (response) {
    // console.log("get back with response");
    localStorage.setItem("admin", JSON.stringify(response.data));
  }
  return response.data;
};

const adminBlockUser = async (userEmail, token) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/blockuser`, // Replace with the actual endpoint
      { email: userEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response) {
      console.log("User blocked:", response.data);
      localStorage.setItem("admin", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error.message);
    throw new Error(error.message);
  }
};

const adminUnblockUser = async (userEmail, token) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/unblockuser`, // Replace with the actual endpoint
      { email: userEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response) {
      console.log("User unblocked:", response.data);
      localStorage.setItem("admin", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Error unblocking user:", error.message);
    throw new Error(error.message);
  }
};



const createUser = async (userData, token) => {
  try {
    const response = await axiosInstance.post(
      API_URL + "/createuser",
      userData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data) {
      // localStorage.setItem('user',JSON.stringify(response.data))
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const adminLogout = () => {
  localStorage.removeItem("admin");
};

const adminService = {
  adminLogin,
  adminBlockUser,
  adminUnblockUser,
  createUser,
  adminLogout
};

export default adminService;
