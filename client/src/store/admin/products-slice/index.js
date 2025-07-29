import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
      //this particular error is to get message from the backend and its very good when gettting backend
      console.log("Full error details:", error.response.data);
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
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

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchproductdetails",
  async (id, thunkAPI) => {
    if (!id || isNaN(id)) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Invalid product ID",
      });
    }
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      return result.data;
    } catch (error) {
      console.log("Full error details:", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getFilteredProducts = createAsyncThunk(
  "/products/filter",
  async (filterQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/filter`,
        {
          params: filterQuery,
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
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
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(getFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || action.payload;
      })
      .addCase(getFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
