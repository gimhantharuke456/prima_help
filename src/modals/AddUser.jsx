import React, { useState } from "react";
import { Modal, Button, Box, Typography, Grid, TextField } from "@mui/material";
import { useErrorContext } from "../store/error_store";
import { useLoading } from "../store/loading_store";
import { createAdmin } from "../services/user_service";
import { modalStyle } from "../configs";
const AddUser = ({ open, handleClose }) => {
  const { setErrorFun } = useErrorContext();
  const { loadingDispatch } = useLoading();

  //use states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  //helper functions
  const handleSubmit = async (event) => {
    event.preventDefault();

    let newErrors = {};

    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
    } else {
      loadingDispatch({
        type: "SET_LOADING",
      });
      try {
        await createAdmin(formData.email, formData.password, formData.name);
      } catch (error) {
        setErrorFun(`${error}`);
      }
      loadingDispatch({
        type: "SET_NOT_LOADING",
      });
      handleClose();
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5">Add Admin</Typography>
        <div style={{ marginTop: "16px", width: "100%" }}>
          <form className="input-form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  className="text-input"
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className="text-input"
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className="text-input"
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </Grid>
            </Grid>

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                style={{ width: "100px", margin: "16px 0" }}
                color="primary"
                variant="contained"
                type="submit"
              >
                CREATE
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default AddUser;
