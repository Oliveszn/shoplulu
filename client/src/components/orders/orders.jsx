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
import { Package } from "lucide-react";

const Orders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.order);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "shipped":
        return <Truck size={16} className="text-amber-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="space-y-6">
      {/* Orders Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Package size={16} />
          <span>{orderList?.length || 0} orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold">Order ID</TableCell>
              <TableCell className="font-semibold">Date</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Total</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">
                    #{orderItem?.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>{orderItem?.order_date.split("T")[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(orderItem?.order_status)}
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          orderItem?.order_status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : orderItem?.order_status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : orderItem?.order_status === "shipped"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {orderItem?.order_status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="font-semibold">
                        ${orderItem?.total_amount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?.id)}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          className: "rounded-lg",
        }}
      >
        <OrderDetails orderDetails={orderDetails} />
      </Dialog>
    </div>
  );
};

export default Orders;
