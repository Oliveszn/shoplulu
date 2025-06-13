import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import CartSlice from "./cart-slice";
import snackbarReducer from "./ui/snackbarslice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    cart: CartSlice,

    //UI
    snackbar: snackbarReducer,
  },
});

export default store;
