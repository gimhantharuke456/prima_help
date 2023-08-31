import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, Modal, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { modalStyle } from "../configs";
import { useErrorContext } from "../store/error_store";
import { useLoading } from "../store/loading_store";
import { useProductsContext } from "../store/product_store";
import { useSelectedItemContext } from "../store/selected_item_store";
import ProductService from "../services/ProductService"; // Import ProductService
import { db } from "../firebaseConfig";
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  instock_amount: yup.number().required("In stock amount is required"),
});

const AddProduct = ({ defaultValues, handleOpenClose, open }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    instock_amount: 0,
  });

  const { setErrorFun } = useErrorContext();
  const { loadingDispatch } = useLoading();
  const { productDispatch } = useProductsContext();
  const { setSelectedItem, selectedItem } = useSelectedItemContext();

  const productService = new ProductService(db);

  const createProduct = async (values) => {
    loadingDispatch({
      type: "SET_LOADING",
    });
    setErrorFun("");
    try {
      const data = {
        ...values,
        instock_amount: Number(values.instock_amount),
      };
      await productService.addProduct(data);
      productDispatch({
        type: "CREATE_PRODUCT",
        payload: {
          product: data,
        },
      });
    } catch (error) {
      setErrorFun(`${error}`);
    } finally {
      loadingDispatch({
        type: "SET_NOT_LOADING",
      });
      handleOpenClose();
    }
  };

  const updateProductFunc = async (data) => {
    try {
      setErrorFun("");
      if (data.id) {
        delete data.id;
      }

      await productService.updateProduct(selectedItem.id, data);

      productDispatch({
        type: "UPDATE_PRODUCT",
        payload: {
          updatedProduct: data,
          id: selectedItem.id,
        },
      });

      setSelectedItem(null);
    } catch (err) {
      setErrorFun(`${err}`);
    } finally {
      handleOpenClose();
    }
  };

  useEffect(() => {
    setInitialValues(defaultValues || initialValues);
  }, [defaultValues]);

  return (
    <Modal hideBackdrop open={open} onClose={handleOpenClose}>
      <Box sx={modalStyle}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            defaultValues
              ? updateProductFunc({ ...values, price: Number(values.price) })
              : createProduct(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Name"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="instock_amount"
                    label="Instock Amount"
                    fullWidth
                    error={
                      touched.instock_amount && Boolean(errors.instock_amount)
                    }
                    helperText={
                      touched.instock_amount && touched.instock_amount
                    }
                    // ... (other attributes)
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {defaultValues ? "Edit" : "Add"}
                  </Button>
                  <Button
                    onClick={() => {
                      handleOpenClose();
                    }}
                    variant="outlined"
                    sx={{ marginLeft: 2 }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddProduct;
