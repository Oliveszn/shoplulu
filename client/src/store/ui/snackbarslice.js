// snackbarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  duration: 2000,
  anchorOrigin: { vertical: "bottom", horizontal: "center" },
  transition: null,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar(state, action) {
      const { message, duration = 3000, anchorOrigin } = action.payload;
      state.open = true;
      state.message = message;
      state.duration = duration;
      state.anchorOrigin = anchorOrigin || {
        vertical: "bottom",
        horizontal: "center",
      };
    },
    hideSnackbar(state) {
      state.open = false;
      state.message = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
