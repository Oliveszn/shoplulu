import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import Address from "../components/address/Address";
import Orders from "../components/orders/orders";

const UserAccount = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 2 }}>{children}</Box> : null;
  };
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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="">
          <Tab label="Orders" />
          <Tab label="Address" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Orders />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Address />
      </TabPanel>
    </div>
  );
};

export default UserAccount;
