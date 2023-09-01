import React from "react";
import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Download, Search } from "@mui/icons-material";
const BodyTitles = ({ title, onClick, onDownloadClicked }) => {
  return (
    <div className="body-header">
      <Typography variant="h5">{title}</Typography>
      <div style={{ display: "flex" }}>
        {onDownloadClicked && (
          <IconButton
            onClick={() => {
              onDownloadClicked();
            }}
            style={{ backgroundColor: "#D3D3D3", padding: "8px" }}
          >
            <Download />
          </IconButton>
        )}
        <div style={{ width: 8 }} />
        <IconButton
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#D3D3D3", padding: "8px" }}
          onClick={onClick}
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default BodyTitles;
