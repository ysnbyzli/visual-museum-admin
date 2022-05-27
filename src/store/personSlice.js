import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  addPerson,
  getAllPerson,
  deletePerson,
  updatePerson,
} from "../api/request";
import { yearDifferenceBetweenTwoDates } from "../utils/date";

export const addNewPerson = createAsyncThunk(
  "persons/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addPerson(data);
      message.success("Yeni kişi başarıyla eklendi!");
      return response.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response);
    }
  }
);

export const fetchAllPerson = createAsyncThunk("persons/all", async () => {
  try {
    const response = await getAllPerson();
    return response.data;
  } catch (error) {
    console.log("ALL_PERSON_ERROR -> ", error);
  }
});

export const deleteOnePerson = createAsyncThunk(
  "persons/delete",
  async (id) => {
    try {
      const response = await deletePerson(id);
      message.success("Silme işlemi başarılı!");
      return response.data;
    } catch (error) {
      console.log("DELETE_ONE_PERSON_ERROR -> ", error.response);
    }
  }
);

export const updateOnePerson = createAsyncThunk(
  "persons/update",
  async ({ id, values }) => {
    try {
      const response = await updatePerson(id, values);
      message.success("Güncelleme işlemi başarılı!");
      return response.data;
    } catch (error) {
      console.log("UPDATE_ONE_PERSON_ERROR -> ", error.response);
    }
  }
);
export const personSlice = createSlice({
  name: "persons",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    handleUpdatePerson: (state, action) => {
      state.data = state.data.map((person) =>
        person?._id !== action.payload?._id ? person : action.payload
      );
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewPerson.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(addNewPerson.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    });
    builder.addCase(addNewPerson.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllPerson.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchAllPerson.fulfilled, (state, action) => {
      state.data = action.payload.map((person) => ({
        ...person,
        fullName: `${person?.firstName} ${person?.lastName}`,
        category: person?.category?.title,
        age: yearDifferenceBetweenTwoDates(
          person?.dateOfBirth,
          person?.dateOfDeath
        ),
      }));
      state.loading = false;
    });
    builder.addCase(fetchAllPerson.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteOnePerson.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(deleteOnePerson.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (person) => person._id !== action.payload._id
      );
      state.loading = false;
    });
    builder.addCase(deleteOnePerson.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(updateOnePerson.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(updateOnePerson.fulfilled, (state, action) => {
      state.data = state.data.map((person) =>
        person?._id !== action.payload?._id ? person : action.payload
      );
      state.loading = false;
    });
    builder.addCase(updateOnePerson.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export const { handleUpdatePerson } = personSlice.actions;
export default personSlice.reducer;
