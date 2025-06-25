import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  paymentId: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        orderData,

        { withCredentials: true, timeout: 5000 }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

// export const capturePayment = createAsyncThunk(
//   "/order/capturePayment",
//   async ({ paymentId, payerId, orderId }) => {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/order/capture`,
//       {
//         paymentId,
//         payerId,
//         orderId,
//       }
//     );

//     return response.data;
//   }
// );

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/capture`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to capture payment" }
      );
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/order/list/`,
      { withCredentials: true }
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/order/details/${id}`
    );

    return response.data;
  }
);

/////FOR ADMIN
export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (_, { getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/get`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
            "x-access-token": getState().auth.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/order/status/${id}`,
        {
          order_status: orderStatus,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
            "x-access-token": getState().auth.token,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Update error:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearApprovalURL: (state) => {
      state.approvalURL = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        state.paymentId = action.payload.paymentId;

        // Store in sessionStorage for return from PayPal
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
        sessionStorage.setItem(
          "currentPaymentId",
          JSON.stringify(action.payload.paymentId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
        state.paymentId = null;
        console.error("order creation failed", action.payload);
      })
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        state.approvalURL = null;
        // Clear session storage after successful capture
        sessionStorage.removeItem("currentOrderId");
        sessionStorage.removeItem("currentPaymentId");
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Payment capture failed:", action.payload);
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails, clearApprovalURL } = orderSlice.actions;

export default orderSlice.reducer;
