import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addressFormControls } from "../../config";
import { Card, CardContent, CardHeader } from "@mui/material";
import AddressCard from "./AddressCard";
import CommonForm from "../common/Form";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "../../store/address-slice";
import { showSnackbar } from "../../store/ui/snackbarslice";
import { MapPin, Plus } from "lucide-react";

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
        if (defaultAddress && typeof setCurrentSelectedAddress === "function") {
          setCurrentSelectedAddress(defaultAddress);
        }
      }
    });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Address Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Addresses</h2>
          <p className="text-gray-600 mt-1">Add up to 3 delivery addresses</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{addressList?.length || 0}/3 addresses</span>
        </div>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem, index) => (
            <AddressCard
              addressInfo={singleAddressItem}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
              key={index}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              No addresses found. Add your first address!
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Form */}
      <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Plus size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold">
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Address;
