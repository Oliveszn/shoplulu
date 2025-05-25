import { Drawer } from "@mui/material";
import { useState } from "react";

const MuiDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      <Drawer anchor="left" open={isOpen} onClose={onClose} sx={{ width: 300 }}>
        <h1>side</h1>
      </Drawer>
    </>
  );
};

export default MuiDrawer;
