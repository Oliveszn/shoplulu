import { Button, Card, CardContent } from "@mui/material";
import React from "react";
import {
  fetchAllAddresses,
  setDefaultAddress,
} from "../../store/address-slice";
import { useDispatch } from "react-redux";
import { Badge, Edit, MapPin, Phone, Trash2 } from "lucide-react";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  const dispatch = useDispatch();
  const handleSelectAddress = (addressInfo) => {
    dispatch(setDefaultAddress(addressInfo.id)).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllAddresses());
        if (typeof setCurrentSelectedAddress === "function") {
          setCurrentSelectedAddress(addressInfo);
        }
      }
    });
  };
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        addressInfo.is_default
          ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200 border-[2px]"
          : "hover:shadow-md border-black"
      }`}
      onClick={() => handleSelectAddress(addressInfo)}
    >
      <CardContent className="p-6">
        {/* Default Badge */}
        {addressInfo.is_default && (
          <Badge className="mb-3 bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
            Default Address
          </Badge>
        )}

        {/* Address Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">
                {addressInfo?.address_line1}
              </p>
              <p className="text-gray-600 text-sm">
                {addressInfo?.city}, {addressInfo?.state}{" "}
                {addressInfo?.postal_code}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-gray-500" />
            <span className="text-gray-700 text-sm">{addressInfo?.phone}</span>
            {addressInfo?.phone_2 && (
              <span className="text-gray-500 text-sm">
                • {addressInfo.phone_2}
              </span>
            )}
          </div>

          {addressInfo?.notes && (
            <p className="text-gray-600 text-sm italic bg-gray-100 p-2 rounded">
              "{addressInfo.notes}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4 pt-4 border-t">
          {/* event propagation here prevents bubbling, making sure it doesnt get selected when you hit a button  */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
            className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
          >
            <Edit size={14} />
            <span>Edit</span>
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(addressInfo);
            }}
            className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
