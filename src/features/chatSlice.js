import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_AUTH_ENDPOINT}/conversation`;
const MESSAGES_ENDPOINT = `${process.env.REACT_APP_AUTH_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  messages: [],
  activeConversation: {},
  notifications: [],
  files: [],
};

// Functions

export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      console.log(token);
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const create_open_conversation = createAsyncThunk(
  "conversation/open_create",
  async (values, { rejectWithValue }) => {
    try {
      const { token, reciever_id } = values;
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { reciever_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getCoversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    try {
      const { token, convo_id } = values;
      const { data } = await axios.get(`${MESSAGES_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const sendMessages = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    try {
      const { token, message, convo_id, files } = values;
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}`,
        { message, convo_id, files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.conversations = action.payload;
        state.error = "";
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(create_open_conversation.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(create_open_conversation.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.activeConversation = action.payload;
        state.error = "";
      })
      .addCase(create_open_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCoversationMessages.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(getCoversationMessages.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.messages = action.payload;
        state.error = "";
      })
      .addCase(getCoversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessages.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.status = "suceeded";
        state.messages = [...state.messages, action.payload];
        let conversation = { ...action.payload, latestMessage: action.payload };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.error = "";
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation } = chatSlice.actions;
export default chatSlice.reducer;
