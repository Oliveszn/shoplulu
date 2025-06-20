import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import { Badge, DialogContent, Divider } from "@mui/material";

const OrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      <DialogContent
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID:</p>
              <label>{orderDetails?.id}</label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date:</p>
              <label>{orderDetails?.order_date.split("T")[0]}</label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price:</p>
              <label>${orderDetails?.total_amount}</label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment method:</p>
              <label>{orderDetails?.payment_method}</label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status:</p>
              <label>{orderDetails?.payment_status}</label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Status:</p>
              <label>
                <Badge
                  className={`py-1 px-2 capitalize text-white ${
                    orderDetails?.order_status === "delivered"
                      ? "bg-green-500"
                      : orderDetails?.order_status === "cancelled"
                      ? "bg-red-600"
                      : orderDetails?.order_status === "shipped"
                      ? "bg-amber-500"
                      : "bg-black"
                  }`}
                >
                  {orderDetails?.order_status}
                </Badge>
              </label>
            </div>
          </div>
          <Divider />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails?.order_items &&
                orderDetails?.order_items.length > 0
                  ? orderDetails?.order_items.map((item) => (
                      <li
                        className="flex items-center justify-between"
                        key={item.id}
                      >
                        <span>Title: {item.name}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ${item.price}</span>
                      </li>
                    ))
                  : "bleh"}
              </ul>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>{user.username}</span>
                <span>{orderDetails?.address_line1}</span>
                <span>{orderDetails?.city}</span>
                <span>{orderDetails?.state}</span>
                <span>{orderDetails?.phone}</span>
                <span>{orderDetails?.phone_2}</span>
                <span>{orderDetails?.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </React.Fragment>
  );
};

export default OrderDetails;
