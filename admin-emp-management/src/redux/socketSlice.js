// redux/socketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    connected: false,
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
      state.connected = true;
    },
    clearSocket(state) {
      state.socket = null;
      state.connected = false;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
