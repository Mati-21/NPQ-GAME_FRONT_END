import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice.js";
import UI_Slice from "../features/UI_Slice/UI_Slice.js";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// Persist config
const persistConfig = {
  key: "NPQROOT",
  storage,
};

// Wrap your reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    UI_Slice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export const persistor = persistStore(store);
