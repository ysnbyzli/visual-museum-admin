import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  getAllCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from "../api/request";
import { log } from "../utils/log";

export const fetchAllCategories = createAsyncThunk(
  "categories/getAll",
  async () => {
    try {
      const { data } = await getAllCategories();
      log.success("ALL_CATEGORIES", data);
      return data;
    } catch (error) {}
  }
);

export const deleteOneCategory = createAsyncThunk(
  "categories/deleteOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await deleteCategory(id);
      log.success("DELETE_CATEGORY", data);
      message.success("Kategori silindi!");
      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const addNewCategory = createAsyncThunk(
  "categories/newCategory",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await addCategory(values);
      log.success("ADD_NEW_CATEGORY", data);
      message.success("Yeni kategori eklendi!");
      return data;
    } catch (error) {
      
      return rejectWithValue(error.response);
    }
  }
);

export const updateOneCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ _id, data: values }, { rejectWithValue }) => {
    try {
      const { data } = await updateCategory(_id, values);
      log.success("UPDATE_CATEGORY_REQUEST", data);
      message.success("Kategori başarıyla güncellendi!");
      return data;
    } catch (e) {
      log.error("UPDATE_CATEGORY_REQUEST", e.response);
      return rejectWithValue(e.response);
    }
  }
);
export const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategories.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteOneCategory.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(deleteOneCategory.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (category) => category._id !== action.payload._id
      );
      state.loading = false;
    });
    builder.addCase(deleteOneCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addNewCategory.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(addNewCategory.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    });
    builder.addCase(addNewCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(updateOneCategory.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(updateOneCategory.fulfilled, (state, action) => {
      state.data = state.data.map((category) =>
        category?._id === action.payload?._id ? action.payload : category
      );
      state.loading = false;
    });
    builder.addCase(updateOneCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export default categorySlice.reducer;
