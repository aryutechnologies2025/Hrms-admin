// redux/store.js

import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socketSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({

  reducer: {

    socket: socketReducer,

    chat: chatReducer

  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })

});