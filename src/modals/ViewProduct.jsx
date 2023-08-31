import { Box, Divider, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { modalStyle } from "../configs";
import { useSelectedItemContext } from "../store/selected_item_store";

const ViewProduct = ({ open, handleClose }) => {
  const { selectedItem } = useSelectedItemContext();
  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <Box sx={{ ...modalStyle, overflowY: "auto", maxHeight: "90vh" }}>
        {selectedItem && (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h4">{selectedItem.name}</Typography>
            <Divider />
            <div style={{ width: "100%", margin: "8px 0" }}>
              <img
                src={selectedItem.imageUrl}
                alt="#"
                style={{ width: "100%" }}
              />
            </div>
            <Divider />
            <div style={{ width: "100%", margin: "16px 0" }}>
              <Typography variant="h5" sx={{ fontSize: 16 }}>
                {selectedItem.description}
              </Typography>
            </div>
            <Divider />
            <Grid sx={{ margin: "8px 0" }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="h6">{`LKR ${selectedItem.price}`}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">{`CATEGORY :  ${selectedItem.category}`}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">{`GENDER : ${selectedItem.gender}`}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">{`AGE  : ${selectedItem.ageCategory} yrs`}</Typography>
              </Grid>
            </Grid>
            <Divider />
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ViewProduct;
