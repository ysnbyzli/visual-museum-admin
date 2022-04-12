import { configureStore } from "@reduxjs/toolkit";
import personSlice from "./personSlice";
import eventSlice from "./eventSlice";

export const store = configureStore({
  reducer: {
    persons: personSlice,
    events: eventSlice,
  },
});
