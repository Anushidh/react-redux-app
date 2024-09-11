import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";
const admin = JSON.parse(localStorage.getItem("admin"));

const initialState = {
  admin: admin ? admin : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  userData: admin ? admin.userData : [],
  message: "",
};

export const adminLogin = createAsyncThunk(
  "admin/adminlogin",
  async (admin, thunkAPI) => {
    try {
    
      return await adminService.adminLogin(admin);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString(); 
      return thunkAPI.rejectWithValue(message); 
    }
  }
);

export const adminBlockUser = createAsyncThunk(
  "admin/adminBlockUser",
  async (userEmail, thunkAPI) => {
    const token = thunkAPI.getState().admins.admin.token;
    return adminService.adminBlockUser(userEmail, token);
  }
);

export const adminUnblockUser = createAsyncThunk(
  "admin/adminUnblockUser",
  async (userEmail, thunkAPI) => {
    const token = thunkAPI.getState().admins.admin.token;
    return adminService.adminUnblockUser(userEmail, token);
  }
);

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, thunkAPI) => {
    let token = thunkAPI.getState().admins.admin.token;
    return adminService.createUser(userData, token);
  }
);

export const adminLogout = createAsyncThunk("admin/adminlogout", async () => {
  return await adminService.adminLogout(admin);
});

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        // console.log("hvsjvskjvnsjvnlvn", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
        state.userData = action.payload.userData;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
        state.userData = null;
      })
      .addCase(adminBlockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload.userData; 
      })
      .addCase(adminBlockUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(adminUnblockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminUnblockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload.userData; 
      })
      .addCase(adminUnblockUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload.userData;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
