import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "../../store/orders-slice";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import OrderDetails from "./OrderDetails";

const Orders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.order);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader title="Order history" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Id</TableCell>
              <TableCell align="right">Order Date</TableCell>
              <TableCell align="right">Order Status</TableCell>
              <TableCell align="right">Order Price</TableCell>
              <TableCell align="right">
                <span className="">Details</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem.id}>
                  <TableCell component="th" scope="row">
                    {orderItem?.id}
                  </TableCell>
                  <TableCell align="right">
                    {orderItem?.order_date.split("T")[0]}
                  </TableCell>
                  <TableCell align="right">
                    <Badge
                      className={`py-1 px-2 capitalize text-white ${
                        orderItem?.order_status === "delivered"
                          ? "bg-green-500"
                          : orderItem?.order_status === "cancelled"
                          ? "bg-red-600"
                          : orderItem?.order_status === "shipped"
                          ? "bg-amber-500"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.order_status}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    ${orderItem?.total_amount}
                  </TableCell>
                  <TableCell align="right">
                    <button
                      onClick={
                        () => handleFetchOrderDetails(orderItem?.id)
                        // setOpenDetailsDialog(true)
                      }
                    >
                      View Details
                    </button>

                    <Dialog
                      open={openDetailsDialog}
                      onClose={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                      maxWidth="md"
                      fullWidth={true}
                    >
                      <OrderDetails orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Order history
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;
