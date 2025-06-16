import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import CartSlice from "./cart-slice";
import snackbarReducer from "./ui/snackbarslice";
import addressSlice from "./address-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    cart: CartSlice,
    address: addressSlice,

    //UI
    snackbar: snackbarReducer,
  },
});

export default store;
