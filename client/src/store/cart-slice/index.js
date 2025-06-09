import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const generateGuestId = () =>
  `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const initialState = {
  //   cartItems: [],
  cart: { items: [] },
  status: "idle",
  error: null,
  lastAction: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const isGuest = !auth.token;
    const guestId = localStorage.getItem("guestId") || generateGuestId();
    const guestItems = JSON.parse(localStorage.getItem("guestItems") || "[]");

    try {
      // Optimistic update
      // const tempCart = {
      //   ...(isGuest
      //     ? { guestId, items: [...state.cart.items, { productId, quantity }] }
      //     : { items: [...state.cart.items, { productId, quantity }] }),
      // };
      // localStorage.setItem("tempCart", JSON.stringify(tempCart));
      const payload = {
        productId,
        quantity,
        ...(isGuest && { guestId }),
        ...(!isGuest &&
          guestItems.length > 0 && {
            guestItems,
            guestId: localStorage.getItem("guestId"),
          }),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/${
          isGuest ? "guest" : "user"
        }/add`,
        // { productId, quantity },
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     ...(authToken && { Authorization: `Bearer ${authToken}` }),
        //     ...(isGuest && { "X-Guest-Id": guestId }),
        //   },
        // }
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        }
      );

      // Only persist confirmed server state
      // localStorage.removeItem("tempCart");
      // if (isGuest) {
      //   localStorage.setItem("guestCart", JSON.stringify(response.data));
      // }
      // Clear guest cart if user is authenticated
      if (!isGuest && guestItems.length > 0) {
        localStorage.removeItem("guestItems");
        localStorage.removeItem("guestId");
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
      .addCase(addToCart.pending, (state) => {
        console.log("Cart add PENDING");
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        console.log("Cart add SUCCESS", action.payload);
        state.status = "succeeded";
        // state.cart = action.payload;

        // For new guest carts
        if (!state.cart.guestId) {
          state.cart = action.payload;
        }
        // For existing carts
        else {
          // Merge items while preserving existing quantities
          const mergedItems = [...state.cart.items];

          action.payload.items.forEach((newItem) => {
            const existingIndex = mergedItems.findIndex(
              (item) => item.productId === newItem.productId
            );

            if (existingIndex >= 0) {
              mergedItems[existingIndex].quantity += newItem.quantity;
            } else {
              mergedItems.push(newItem);
            }
          });

          state.cart = {
            ...action.payload,
            items: mergedItems,
          };
        }

        state.lastAction = "add";

        // Persist to localStorage
        // if (!action.payload.userId) {
        //   // Guest cart
        //   localStorage.setItem("guestId", action.payload.guestId);
        //   localStorage.setItem(
        //     "guestItems",
        //     JSON.stringify(action.payload.items)
        //   );
        // }
        // localStorage.setItem("cart", JSON.stringify(action.payload));
        localStorage.setItem("cart", JSON.stringify(state.cart));
      })
      .addCase(addToCart.rejected, (state, action) => {
        console.error("Cart add FAILED", action.error);
        state.status = "failed";
        state.error = action.payload;
        state.lastAction = "add_failed";
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
