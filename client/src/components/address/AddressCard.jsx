import { Button, Card, CardContent } from "@mui/material";
import React from "react";
import {
  fetchAllAddresses,
  setDefaultAddress,
} from "../../store/address-slice";
import { useDispatch } from "react-redux";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  const dispatch = useDispatch();
  const handleSelectAddress = (addressInfo) => {
    // setCurrentSelectedAddress(addressInfo);
    // dispatch(setDefaultAddress(addressInfo.id));
    dispatch(setDefaultAddress(addressInfo.id)).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllAddresses());
        setCurrentSelectedAddress(addressInfo);
      }
    });
  };
  return (
    <Card
      onClick={() => handleSelectAddress(addressInfo)}
      className={`cursor-pointer ${
        addressInfo.is_default ? "border-red-900 border-[4px]" : "border-black"
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

      {/* event propagation here prevents bubbling, making sure it doesnt get selected when you hit a button  */}
      <div className="p-3 flex justify-between">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default AddressCard;
