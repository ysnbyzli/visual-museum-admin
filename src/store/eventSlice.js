import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addEvent, getEventsByPersonId, deleteEvent } from "../api/request";
import { log } from "../utils/log";

export const getAllEvents = createAsyncThunk(
  "events/getAll",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getEventsByPersonId(id);
      log.success("ALL_EVENTS", data);
      return data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response);
    }
  }
);

export const addNewEvent = createAsyncThunk("events/add", async (values) => {
  try {
    const { data } = await addEvent(values);
    log.success("ADD_NEW_EVENT", data);
    return data;
  } catch (error) {
    log.error("ADD_NEW_EVENT", error.response);
  }
});

export const deleteOneEvent = createAsyncThunk("events/delete", async (id) => {
  try {
    const { data } = await deleteEvent(id);
    log.success("DELETE_EVENT", data);
    return data;
  } catch (e) {
    log.error("DELETE_EVENT", e.response);
  }
});

export const eventSlice = createSlice({
  name: "persons",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEvents.pending, (state) => {
      state.error = null;
      state.pending = true;
    });
    builder.addCase(getAllEvents.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllEvents.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addNewEvent.pending, (state) => {
      state.error = null;
      state.pending = true;
    });
    builder.addCase(addNewEvent.fulfilled, (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addNewEvent.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteOneEvent.pending, (state) => {
      state.error = null;
      state.pending = true;
    });
    builder.addCase(deleteOneEvent.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (event) => event._id !== action.payload._id
      );
      state.loading = false;
    });
    builder.addCase(deleteOneEvent.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export default eventSlice.reducer;
