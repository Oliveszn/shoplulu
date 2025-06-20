import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addressFormControls } from "../../config";
import { Card, CardHeader } from "@mui/material";
import AddressCard from "./AddressCard";
import CommonForm from "../common/Form";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "../../store/address-slice";
import { showSnackbar } from "../../store/ui/snackbarslice";

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const initialAddressFormData = {
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    phone_2: "",
    notes: "",
  };
  const [formData, setFormData] = useState(initialAddressFormData);
  //this edited id is used in this page to confirm if the user is editing or just adding so as to know what to dispatch
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);

  const handleManageAddress = (event) => {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      dispatch(
        showSnackbar({
          message: "You can add max 3 addresses",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        })
      );

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses());
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            dispatch(
              showSnackbar({
                message: "Address updated successfully",
                anchorOrigin: { vertical: "top", horizontal: "center" },
              })
            );
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses());
            setFormData(initialAddressFormData);
            dispatch(
              showSnackbar({
                message: "Address added successfully",
                anchorOrigin: { vertical: "top", horizontal: "center" },
              })
            );
          }
        });
  };

  const handleDeleteAddress = (getCurrentAddress) => {
    dispatch(deleteAddress({ addressId: getCurrentAddress.id })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses());
          dispatch(
            showSnackbar({
              message: "Address deleted successfully",
              anchorOrigin: { vertical: "top", horizontal: "center" },
            })
          );
        }
      }
    );
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?.id);
    setFormData({
      ...formData,
      address_line1: getCurrentAddress?.address_line1,
      city: getCurrentAddress?.city,
      state: getCurrentAddress?.state,
      postal_code: getCurrentAddress?.postal_code,
      phone: getCurrentAddress?.phone,
      phone_2: getCurrentAddress?.phone_2,
      notes: getCurrentAddress?.notes,
    });
  };

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  };

  useEffect(() => {
    dispatch(fetchAllAddresses()).then((res) => {
      const addresses = res?.payload?.data;
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses.find((a) => a.is_default);
        if (defaultAddress) {
          setCurrentSelectedAddress(defaultAddress);
        }
      }
    });
  }, [dispatch]);

  return (
    <Card className="w-full p-4 shadow-md" sx={{ maxWidth: 400 }}>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem, index) => (
            <AddressCard
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
              key={index}
            />
          ))
        ) : (
          <p>No addresses found.</p>
        )}
      </div>
      <CardHeader
        title={currentEditedId !== null ? "Edit Address" : "Add New Address"}
      />
      <div className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </div>
    </Card>
  );
};

export default Address;
