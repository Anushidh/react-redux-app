import axiosInstance from "../../utils/axios";

const API_URL = "/";

const register = async (userData) => {
  try {
    const response = await axiosInstance.post(API_URL + "signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axiosInstance.post(API_URL + "signin", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response.data.message);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "An unexpected error occurred");
  }
};

const updateUser = async (userData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    };
    console.log('inside updateuser')
    const response = await axiosInstance.put(
      API_URL + "updateUser",
      userData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('rqst made')
    console.log(response);
    if (response.data) {
      const udata = JSON.parse(localStorage.getItem("user"));
      console.log(udata.token);
      const data = {
        ...response.data,
        token: udata.token,
      };
      localStorage.setItem("user", JSON.stringify(data));
    }
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
  updateUser,
};

export default authService;
