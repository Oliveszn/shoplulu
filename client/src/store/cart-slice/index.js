import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cart: { items: [] },
  status: "idle" | "loading" | "succeeded" | "failed",
  error: null,
  lastAction: null,
};

export const addToCartUnified = createAsyncThunk(
  "cart/addToCartUnified",
  async ({ productId, quantity, userId, isAuthenticated }, thunkAPI) => {
    try {
      if (isAuthenticated) {
        // User is authenticated - use user cart endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart/user/add`,
          {
            productId,
            quantity,
          },
          {
            withCredentials: true,
          }
        );
        return { ...response.data, type: "user" };
      } else {
        // Get or generate guest ID
        let guestId = localStorage.getItem("guestId");
        if (!guestId) {
          guestId = `guest_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart/guest/add`,
          {
            productId,
            quantity,
            guestId,
          }
        );

        return { ...response.data, type: "guest" };
      }
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const fetchGuestCartItems = createAsyncThunk(
  "cart/fetchGuestCartItems",
  async (guestId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/guest/${guestId}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch guest cart" }
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/cart/user/get`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/cart/user/update-cart`,
      {
        productId,
        quantity,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/user/delete`,
      {
        data: { productId },
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const CartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    resetCartStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    loadCartFromStorage(state) {
      const savedCart =
        JSON.parse(localStorage.getItem("cart")) || initialState.cart;
      state.cart = savedCart;
    },
    clearCart(state) {
      state.cart = { items: [] };
      localStorage.removeItem("cart");
      localStorage.removeItem("guestItems");
      localStorage.removeItem("guestId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartUnified.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartUnified.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;

        if (action.payload.type === "guest" && action.payload.guestId) {
          state.cart.guestId = action.payload.guestId;
          localStorage.setItem("guestId", action.payload.guestId);
        }

        state.lastAction = "add";
      })
      .addCase(addToCartUnified.rejected, (state, action) => {
        console.error("Cart add FAILED", action.error);
        state.status = "failed";
        state.error = action.payload;
        state.cart.items = [];
        state.lastAction = "add_failed";
      })
      .addCase(fetchGuestCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGuestCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
        state.lastAction = "fetched_guest_cart";
      })
      .addCase(fetchGuestCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.lastAction = "fetch_guest_cart_failed";
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
        console.log("Delete fulfilled payload:", action.payload);
        console.log("Delete fulfilled payload:", action.payload.data);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCartStatus, loadCartFromStorage, clearCart } =
  CartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export default CartSlice.reducer;
