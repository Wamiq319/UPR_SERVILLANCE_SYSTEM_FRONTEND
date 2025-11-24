import { configureStore } from "@reduxjs/toolkit";
import resourcesReducer from "./slices/resourcesSLice"; // adjust path

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
  },
});
