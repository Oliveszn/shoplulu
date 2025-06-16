import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle" | "loading" | "succeeded" | "failed",
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/address/add`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/address/get`,

      { withCredentials: true }
    );

    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ addressId, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/address/edit/${addressId}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/address/delete/${addressId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressList = action.payload.data;
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editaAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressList = action.payload.data;
      })
      .addCase(editaAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressList = action.payload.data;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
