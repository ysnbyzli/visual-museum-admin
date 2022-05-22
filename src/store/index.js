import { configureStore } from "@reduxjs/toolkit";
import personSlice from "./personSlice";
import eventSlice from "./eventSlice";
import categorySlice from "./categorySlice";
import tagSlice from "./tagSlice";

export const store = configureStore({
  reducer: {
    persons: personSlice,
    events: eventSlice,
    categories: categorySlice,
    tags: tagSlice,
  },
});
