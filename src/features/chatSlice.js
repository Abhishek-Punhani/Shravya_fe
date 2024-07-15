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
  call: undefined,
  incomingCall: undefined,
};

// Functions

export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
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
      const { token, reciever_id, isGroup } = values;
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { reciever_id, isGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getConversationId = createAsyncThunk(
  "conversation/getId",
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

      return data._id;
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
        withCredentials: true,
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
      const { token, message, convo_id, file, isReply, isForwarded } = values;
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}`,
        { message, convo_id, file, isReply, isForwarded },
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
export const createGroupConvo = createAsyncThunk(
  "conversation/create_group",
  async (values, { rejectWithValue }) => {
    try {
      const { token, name, users, description, picture } = values;
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users, description, picture },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getZegoToken = createAsyncThunk(
  "getZegoToken",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${CONVERSATION_ENDPOINT}/get_zego_token`,
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

export const editMessage = createAsyncThunk(
  "editMessage",
  async (values, { rejectWithValue }) => {
    try {
      const { token, message } = values;
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}/edit`,
        { message },
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

export const deleteMessage = createAsyncThunk(
  "DeleteMessage",
  async (values, { rejectWithValue }) => {
    try {
      const { token, id, LastMessage } = values;
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}/delete`,
        { id, LastMessage },
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
export const deleteConversation = createAsyncThunk(
  "DeleteConversation",
  async (values, { rejectWithValue }) => {
    try {
      const { id, token } = values;
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/delete`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
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
    updateMessages: (state, action) => {
      // update msg if reciever is online
      let convo = state.activeConversation;
      if (convo._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload];
      }
      // updating the convo
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    clearFiles: (state, action) => {
      state.files = [];
    },
    removeFile: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = files[index];
      files = files.filter((file) => file !== fileToRemove);
      state.files = [...files];
    },
    setCall: (state, action) => {
      return {
        ...state,
        call: action.payload,
      };
    },
    setIncomingCall: (state, action) => {
      return {
        ...state,
        incomingCall: action.payload,
      };
    },
    endCall: (state, action) => {
      return {
        ...state,
        call: undefined,
        incomingCall: undefined,
      };
    },
    updateEditedMessage: (state, action) => {
      const messages = [...state.messages];
      const i = messages.findIndex((msg) => msg._id === action.payload._id);
      messages[i].message = action.payload.message;
      messages[i].isEdited = true;
      state.messages = [...messages];
      if (i === messages.length - 1) {
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.files = [];
        state.error = "";
      }
    },
    updateDeleteMessages: (state, action) => {
      let messages = [...state.messages];
      messages = messages.filter((msg) => msg._id !== action.payload._id);
      state.messages = [...messages];
      if (!action.payload.conversation?.latestMessage) {
        let conversation = {
          ...action.payload.conversation,
          latestMessage: messages[messages.length - 1],
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
      }
    },
    updateFileMessage: (state, action) => {
      let { i, msg } = action.payload;
      let files = [...state.files];
      files[i].message = msg;
      state.files = [...files];
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
        state.files = [];
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
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.files = [];
        state.error = "";
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editMessage.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.status = "suceeded";
        const messages = [...state.messages];
        const i = messages.findIndex((msg) => msg._id === action.payload._id);
        messages[i].message = action.payload.message;
        messages[i].isEdited = true;
        state.messages = [...messages];
        if (i === messages.length - 1) {
          let conversation = {
            ...action.payload.conversation,
            latestMessage: action.payload,
          };
          let newConvos = [...state.conversations].filter(
            (c) => c._id !== conversation._id
          );
          newConvos.unshift(conversation);
          state.conversations = newConvos;
          state.files = [];
        }
        state.error = "";
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteMessage.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.status = "suceeded";
        let messages = [...state.messages];
        messages = messages.filter((msg) => msg._id !== action.payload._id);
        state.messages = [...messages];
        if (!action.payload.conversation?.latestMessage) {
          let conversation = {
            ...action.payload.conversation,
            latestMessage: messages[messages.length - 1],
          };
          let newConvos = [...state.conversations].filter(
            (c) => c._id !== conversation._id
          );
          newConvos.unshift(conversation);
          state.conversations = newConvos;
        }
        state.error = "";
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteConversation.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.status = "suceeded";
        let conversations = [...state.conversations];
        conversations = conversations.filter(
          (convo) => convo._id !== action.payload._id
        );
        state.conversations = [...conversations];
        if (state.activeConversation._id === action.payload._id) {
          state.activeConversation = undefined;
        }
        state.error = "";
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  updateMessages,
  addFiles,
  clearFiles,
  removeFile,
  setCall,
  setIncomingCall,
  endCall,
  updateEditedMessage,
  updateDeleteMessages,
  updateFileMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
