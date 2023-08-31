import React from "react";
import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const BodyTitles = ({ title, onClick }) => {
  return (
    <div className="body-header">
      <Typography variant="h5">{title}</Typography>
      <IconButton
        variant="contained"
        color="primary"
        style={{ backgroundColor: "#D3D3D3", padding: "8px" }}
        onClick={onClick}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default BodyTitles;
