import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cart: { items: [] },
  status: "idle",
  error: null,
  lastAction: null,
};

export const addToGuestCart = createAsyncThunk(
  "cart/addToGuestCart",
  async ({ productId, quantity, guestId }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/guest/add`,
        {
          productId,
          quantity,
          guestId,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const addToUserCart = createAsyncThunk(
  "cart/addToUserCart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/user/add`,
        {
          productId,
          quantity,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/cart/user/get`
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
      }
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart?deleteCartItem",
  async ({ productId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/user/delete`,
      {
        data: { productId },
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
      .addCase(addToGuestCart.pending, (state) => {
        console.log("Cart add PENDING");
        state.status = "loading";
      })
      .addCase(addToGuestCart.fulfilled, (state, action) => {
        console.log("Cart add SUCCESS", action.payload);
        state.status = "succeeded";
        state.cart = action.payload.data;
        state.lastAction = "add";

        // Persist to localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));

        //  Save guestId if returned
        if (action.payload.guestId) {
          state.cart.guestId = action.payload.guestId;
          localStorage.setItem("guestId", action.payload.guestId);
        }
      })
      .addCase(addToGuestCart.rejected, (state, action) => {
        console.error("Cart add FAILED", action.error);
        state.status = "failed";
        state.error = action.payload;
        state.lastAction = "add_failed";
      })
      .addCase(addToUserCart.pending, (state) => {
        console.log("Cart add PENDING");
        state.status = "loading";
      })
      .addCase(addToUserCart.fulfilled, (state, action) => {
        console.log("Cart add SUCCESS", action.payload);
        state.status = "succeeded";
        state.cart = action.payload.data;
        state.lastAction = "add";
      })
      .addCase(addToUserCart.rejected, (state) => {
        console.error("Cart add FAILED", action.error);
        state.status = "failed";
        state.error = action.payload;
        state.cart.items = [];
        state.lastAction = "add_failed";
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.status = "failed";
        state.cart.items = [];
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.status = "failed";
        state.cart.items = [];
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.status = "failed";
        state.cart.items = [];
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
export const selectCartTotalItems = (state) =>
  state.cart.cart.items.reduce((total, item) => total + item.quantity, 0);

export default CartSlice.reducer;
