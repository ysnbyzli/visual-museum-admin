import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { addTag, deleteTag, getAllTags, updateTag } from "../api/request";
import { log } from "../utils/log";

export const fetchAllTags = createAsyncThunk("categories/getAll", async () => {
  try {
    const { data } = await getAllTags();
    log.success("ALL_CATEGORIES", data);
    return data;
  } catch (error) {}
});

export const addNewTag = createAsyncThunk("tags/add", async (values) => {
  try {
    const { data } = await addTag(values);
    log.success("ADD_NEW_TAG", data);
    return data;
    message.success("Yeni bir etiket oluşturuldu!");
  } catch (e) {
    log.error("ADD_NEW_TAG", e.response);
  }
});

export const updateOneTag = createAsyncThunk(
  "tags/update",
  async ({ _id, data: values }) => {
    try {
      const { data } = await updateTag(_id, values);
      log.error("UPDATE_TAG_REQUEST", data);
      return data;
    } catch (e) {
      log.error("UPDATE_TAG_REQUEST", e.response);
    }
  }
);

export const deleteOneTag = createAsyncThunk("tags/delete", async (id) => {
  try {
    const { data } = await deleteTag(id);
    log.success("DELETE_TAG_REQUEST", data);
    return data;
  } catch (e) {
    log.error("DELETE_TAG_REQUEST", e.response);
  }
});

export const tagSlice = createSlice({
  name: "tags",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTags.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchAllTags.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllTags.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addNewTag.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(addNewTag.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.loading = false;
    });
    builder.addCase(addNewTag.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(updateOneTag.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(updateOneTag.fulfilled, (state, action) => {
      state.data = state.data.map((tag) =>
        tag._id !== action.payload._id ? tag : action.payload
      );
      state.loading = false;
    });
    builder.addCase(updateOneTag.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteOneTag.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(deleteOneTag.fulfilled, (state, action) => {
      state.data = state.data.filter((tag) => tag._id !== action.payload._id);
    });
    builder.addCase(deleteOneTag.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export default tagSlice.reducer;
