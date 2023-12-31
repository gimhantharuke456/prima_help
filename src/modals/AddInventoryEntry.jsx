import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, MenuItem, Grid } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useInventoryContext } from "../store/inventory_store";
import { useProductsContext } from "../store/product_store";
import DatePicker from "react-datepicker"; // You might need to install this package
import { modalStyle } from "../configs";
import "react-datepicker/dist/react-datepicker.css";
import { dateFormatter } from "../services/date_formatter";
import InventoryService from "../services/InventoryService";
import { db } from "../firebaseConfig";
import { useErrorContext } from "../store/error_store";

const validationSchema = yup.object().shape({
  productId: yup.string().required("Product is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  date: yup.date().required("Date is required"),
});

const AddInventoryEntry = ({ open, handleOpenClose, getProducts }) => {
  const inventoryService = new InventoryService(db);
  const { inventoryState, inventoryDispatch } = useInventoryContext();
  const { productState } = useProductsContext();
  const [selectedProductStock, setSelectedProductStock] = useState(0);
  const [selectedProductStockConst, setSelectedProductStockConst] = useState(0);
  const { setErrorFun } = useErrorContext();
  const initialValues = {
    productId: "",
    quantity: selectedProductStock,
    date: new Date(),
  };

  const createInventoryEntry = async (values) => {
    try {
      if (values.quantity > selectedProductStockConst) {
        setErrorFun("Selected Product is out of stock");
        handleOpenClose();
        return;
      }
      setErrorFun("");
      const product = productState.products.find((p) => {
        return p.id === values.productId;
      });
      const foundItem = inventoryState.entries.find(
        (item) => item.productId === values.productId
      );
      await inventoryService.addInventory({
        ...values,
        date: dateFormatter(values.date),
      });
      if (!foundItem) {
        inventoryDispatch({
          type: "ADD_ENTRY",
          payload: {
            entry: {
              productId: values.productId,
              product: product.name,
              quantity: values.quantity,
              date: dateFormatter(values.date),
            },
          },
        });
      } else {
        getProducts();
      }

      handleOpenClose();
    } catch (error) {
      console.error("Error adding inventory entry:", error);
    }
  };

  return (
    <Modal hideBackdrop open={open} onClose={handleOpenClose}>
      <Box sx={{ ...modalStyle, width: "35%" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={createInventoryEntry}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Field
                    as={TextField}
                    name="productId"
                    label="Product"
                    fullWidth
                    select
                    onChange={(event) => {
                      const productId = event.target.value;
                      const product = productState.products.find(
                        (p) => p.id === productId
                      );
                      if (product) {
                        setSelectedProductStock(product.instock_amount);
                        setSelectedProductStockConst(product.instock_amount);
                        setFieldValue("quantity", product.instock_amount);
                      }
                      setFieldValue("productId", productId);
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select a product
                    </MenuItem>
                    {productState.products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.productId && touched.productId && (
                    <div>{errors.productId}</div>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Field
                    as={TextField}
                    name="quantity"
                    label="Quantity"
                    fullWidth
                    type="number"
                  />
                  {errors.quantity && touched.quantity && (
                    <div>{errors.quantity}</div>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Field name="date">
                    {({ field, form }) => (
                      <div
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "14px",
                          height: "100%",
                        }}
                      >
                        {" "}
                        <DatePicker
                          {...field}
                          selected={field.value}
                          onChange={(date) =>
                            form.setFieldValue(field.name, date)
                          }
                        />
                      </div>
                    )}
                  </Field>
                  {errors.date && touched.date && <div>{errors.date}</div>}
                </Grid>

                <Grid item xs={6}>
                  <Button type="submit" variant="contained" color="primary">
                    Add Entry
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => {
                      handleOpenClose();
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
              <div style={{ height: 8 }} />
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddInventoryEntry;
