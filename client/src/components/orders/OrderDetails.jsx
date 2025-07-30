import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import { Badge, DialogContent, Divider } from "@mui/material";

const OrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-600";
      case "shipped":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DialogContent className="p-6">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h2>
        <p className="text-gray-600">Order #{orderDetails?.id}</p>
      </div>

      <div className="grid gap-8">
        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Order Information
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {orderDetails?.order_date.split("T")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">
                  ${orderDetails?.total_amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {orderDetails?.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-medium">
                  {orderDetails?.payment_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status:</span>
                <Badge
                  className={`py-1 px-3 rounded-full text-white text-sm font-medium capitalize ${getStatusColor(
                    orderDetails?.order_status
                  )}`}
                >
                  {orderDetails?.order_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Shipping Address
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-medium">{user?.username}</p>
              <p className="text-gray-700">{orderDetails?.address_line1}</p>
              <p className="text-gray-700">
                {orderDetails?.city}, {orderDetails?.state}
              </p>
              <div className="pt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  📱 {orderDetails?.phone}
                </p>
                {orderDetails?.phone_2 && (
                  <p className="text-sm text-gray-600">
                    📱 {orderDetails?.phone_2}
                  </p>
                )}
                {orderDetails?.notes && (
                  <p className="text-sm text-gray-600 italic">
                    Note: {orderDetails?.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>

          <div className="space-y-3">
            {orderDetails?.order_items &&
            orderDetails?.order_items.length > 0 ? (
              orderDetails?.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.price}</p>
                    <p className="text-sm text-gray-600">
                      ${(item.price * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No items found</p>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default OrderDetails;
