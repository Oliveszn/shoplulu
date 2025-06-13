import { Drawer } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

const MuiDrawer = ({
  isOpen,
  onClose,
  anchor = "right",
  width = "28vw",
  maxWidth = "600px",
  children,
}) => {
  return (
    <Drawer
      anchor={anchor}
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: width,
          maxWidth: maxWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <div className="p-6">
        <div>
          <button onClick={onClose} className="cursor-pointer ml-auto flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M8.17 13.83L13.83 8.17M13.83 13.83L8.17 8.17M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                stroke="#1A0C0B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>

        {children}
      </div>
    </Drawer>
  );
};

MuiDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchor: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  width: PropTypes.string,
  maxWidth: PropTypes.string,
  children: PropTypes.node,
};

export default MuiDrawer;
