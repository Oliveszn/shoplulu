import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../../store/ui/snackbarslice";
import Slide from "@mui/material/Slide";

const MuiSnackbar = ({}) => {
  const dispatch = useDispatch();
  const { open, message, duration, anchorOrigin, transition } = useSelector(
    (state) => state.snackbar
  );
  const TransitionComponent = transition || Slide;
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={() => dispatch(hideSnackbar())}
      message={message}
      anchorOrigin={anchorOrigin}
      slots={{ transition: TransitionComponent }}
      key={TransitionComponent?.name}
    />
  );
};

export default MuiSnackbar;
