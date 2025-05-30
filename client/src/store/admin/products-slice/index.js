import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData, { getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Token:", token);
      return response?.data;
    } catch (error) {
      console.log(error);
      //this particular error is to get message from the backend and its very good when gettting backend
      console.log("Full error details:", error.response.data);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchallproducts",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/products/get`
    );
    return response?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editproduct",
  async ({ id, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteproduct",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/products/delete/${id}`
    );
    return response?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
