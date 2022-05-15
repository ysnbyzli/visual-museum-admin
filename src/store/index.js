import { configureStore } from "@reduxjs/toolkit";
import personSlice from "./personSlice";
import eventSlice from "./eventSlice";
import categorySlice from "./categorySlice";

export const store = configureStore({
  reducer: {
    persons: personSlice,
    events: eventSlice,
    categories: categorySlice,
  },
});
