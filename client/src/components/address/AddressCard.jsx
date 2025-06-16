import { Button, Card, CardContent } from "@mui/material";
import React from "react";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <label>Address: {addressInfo?.address_line1}</label>
        <label>City: {addressInfo?.city}</label>
        <label>State: {addressInfo?.state}</label>
        <label>postalcode: {addressInfo?.postal_code}</label>
        <label>Phone: {addressInfo?.phone}</label>
        <label>Phone: {addressInfo?.phone_2}</label>
        <label>Notes: {addressInfo?.notes}</label>
      </CardContent>
      <div className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </div>
    </Card>
  );
};

export default AddressCard;
