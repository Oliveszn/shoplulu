import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  //   cartItems: [],
  cart: { items: [] },
  isLoading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const state = getState();
    const authToken = state.auth.token;
    const isGuest = !authToken;
    const guestId = localStorage.getItem("guestId") || generateGuestId();

    try {
      // Optimistic update
      const tempCart = {
        ...(isGuest
          ? { guestId, items: [...state.cart.items, { productId, quantity }] }
          : { items: [...state.cart.items, { productId, quantity }] }),
      };
      localStorage.setItem("tempCart", JSON.stringify(tempCart));
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, quantity },
        {
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
            ...(isGuest && { "X-Guest-Id": guestId }),
          },
        }
      );

      // Only persist confirmed server state
      localStorage.removeItem("tempCart");
      if (isGuest) {
        localStorage.setItem("guestCart", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem("tempCart");
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to add to cart",
        productId,
        quantity,
      });
    }
  }
);

const CartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    syncCartFromLocalStorage(state) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
      };
      state.cart = localCart;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        // state.cartItems = [];
        state.error = action.payload;
      });
  },
});

export const { syncCartFromLocalStorage } = CartSlice.actions;
export default CartSlice.reducer;
