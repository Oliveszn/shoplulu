import React, { useState } from "react";
import Address from "../components/address/Address";

const Checkout = () => {
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  return (
    <div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <Address
        selectedId={currentSelectedAddress}
        setCurrentSelectedAddress={setCurrentSelectedAddress}
      />
    </div>
  );
};

export default Checkout;
