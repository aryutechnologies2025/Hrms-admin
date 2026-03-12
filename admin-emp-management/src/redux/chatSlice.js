import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    unreadDM: {},
    unreadChannels: {},
    selectedUser: null,
    selectedChannel: null,
    slackActivePage: false
  },

  reducers: {

    incrementDM(state, action) {
      const userId = action.payload;

      state.unreadDM[userId] =
        (state.unreadDM[userId] || 0) + 1;
    },

    clearDM(state, action) {
      const userId = action.payload;

      state.unreadDM[userId] = 0;
    },

    incrementChannel(state, action) {
      const channelId = action.payload;

      state.unreadChannels[channelId] =
        (state.unreadChannels[channelId] || 0) + 1;
    },

    clearChannel(state, action) {
      const channelId = action.payload;

      state.unreadChannels[channelId] = 0;
    },

    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },

    setSelectedChannel(state, action) {
      state.selectedChannel = action.payload;
    },
    SetSLackActivePage(state, action) {
      state.slackActivePage = action.payload;
    }

  }
});

export const {
  incrementDM,
  clearDM,
  incrementChannel,
  clearChannel,
  setSelectedUser,
  setSelectedChannel,
  SetSLackActivePage
} = chatSlice.actions;

export default chatSlice.reducer;