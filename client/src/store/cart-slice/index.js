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

export const updateCartQuantityUnified = createAsyncThunk(
  "cart/updateCartQuantityUnified",
  async ({ productId, quantity, userId, isAuthenticated }, thunkAPI) => {
    try {
      if (isAuthenticated) {
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
        return { ...response.data, type: "user" };
      } else {
        // Get or generate guest ID
        let guestId = localStorage.getItem("guestId");
        // if (!guestId) {
        //   guestId = `guest_${Date.now()}_${Math.random()
        //     .toString(36)
        //     .slice(2)}`;
        // }

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/guest/update-cart`,
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

export const deleteCartItemUnified = createAsyncThunk(
  "cart/deleteCartItemUnified",
  async ({ productId, userId, isAuthenticated }, thunkAPI) => {
    try {
      if (isAuthenticated) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/cart/user/delete`,
          {
            data: { productId },
            withCredentials: true,
          }
        );
        return { ...response.data, type: "user" };
      } else {
        // Get or generate guest ID
        let guestId = localStorage.getItem("guestId");
        // if (!guestId) {
        //   guestId = `guest_${Date.now()}_${Math.random()
        //     .toString(36)
        //     .slice(2)}`;
        // }

        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/cart/guest/delete`,
          {
            data: { productId, guestId },
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
        state.status = "failed";
        state.error = action.payload;
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
      .addCase(updateCartQuantityUnified.pending, (state) => {
        // state.status = "loading";
      })
      .addCase(updateCartQuantityUnified.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;

        state.lastAction = "update_succeeded";

        if (action.payload.type === "guest" && action.payload.guestId) {
          state.cart.guestId = action.payload.guestId;
          localStorage.setItem("guestId", action.payload.guestId);
        }
      })
      .addCase(updateCartQuantityUnified.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
        state.lastAction = "update_failed";
      })
      .addCase(deleteCartItemUnified.pending, (state) => {
        // state.status = "loading";
      })
      .addCase(deleteCartItemUnified.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
        state.lastAction = "delete_succeeded";

        if (action.payload.type === "guest" && action.payload.guestId) {
          state.cart.guestId = action.payload.guestId;
          localStorage.setItem("guestId", action.payload.guestId);
        }
      })
      .addCase(deleteCartItemUnified.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.lastAction = "delete_failed";
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
