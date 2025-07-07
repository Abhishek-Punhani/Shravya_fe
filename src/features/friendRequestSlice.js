import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const REQUEST_ENDPOINT = `${process.env.REACT_APP_AUTH_ENDPOINT}/request`;

export const sendFriendRequest = createAsyncThunk(
  "friendRequest/send",
  async ({ token, receiver, dhPublicKey, rsaPublicKey }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${REQUEST_ENDPOINT}/send`,
        { receiver, dhPublicKey, rsaPublicKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getPendingRequests = createAsyncThunk(
  "friendRequest/pending",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${REQUEST_ENDPOINT}/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friendRequest/accept",
  async ({ token, requestId, dhPublicKey, rsaPublicKey }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${REQUEST_ENDPOINT}/accept`,
        { requestId, dhPublicKey, rsaPublicKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getOutgoingRequests = createAsyncThunk(
  "friendRequest/outgoing",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${REQUEST_ENDPOINT}/outgoing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState: {
    pending: [],
    outgoing: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pending = action.payload;
        state.error = null;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // Optionally remove the accepted request from pending
        state.pending = state.pending.filter(r => r._id !== action.meta.arg.requestId);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getOutgoingRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOutgoingRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.outgoing = action.payload;
        state.error = null;
      })
      .addCase(getOutgoingRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default friendRequestSlice.reducer; 