import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const AUTH_ENDPOINT = `${process.env.REACT_APP_AUTH_ENDPOINT}/auth`;
const USER_ENDPOINT = `${process.env.REACT_APP_AUTH_ENDPOINT}/user`;

const initalState = {
  status: "",
  error: "",
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",
  },
};
export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/register`,
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/login`,
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const googleLogin = createAsyncThunk(
  "auth/google",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/google`,
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const updateUserInfo = createAsyncThunk(
  "updateUserinfo",
  async (values, { rejectWithValue }) => {
    try {
      const { token, user } = values;
      const { data } = await axios.post(
        `${USER_ENDPOINT}/update`,
        {
          user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: initalState,
  reducers: {
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
      };
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.error = "";
        let user = { ...state.user, ...action.payload };
        state.user = user;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, changeStatus } = userSlice.actions;
export default userSlice.reducer;
