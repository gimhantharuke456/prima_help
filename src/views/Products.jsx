import React, { useState, useEffect } from "react";
import { Container, Pagination, TextField } from "@mui/material";
import { useProductsContext } from "../store/product_store";
import { useLoading } from "../store/loading_store";
import BodyTitles from "../components/BodyTitles";
import { useErrorContext } from "../store/error_store";

import AddProduct from "../modals/AddProduct";
import CommonTable from "../components/CommonTable";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { useSelectedItemContext } from "../store/selected_item_store";
import ViewProduct from "../modals/ViewProduct";
import ProductService from "../services/ProductService";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useInventoryContext } from "../store/inventory_store";
const Products = () => {
  const productsService = new ProductService(db);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  //contexts
  const { loadingDispatch } = useLoading();
  const { setErrorFun } = useErrorContext();
  const { productState, productDispatch } = useProductsContext();
  const { selectedItem, setSelectedItem } = useSelectedItemContext();
  const { inventoryState, inventoryDispatch } = useInventoryContext();
  //use states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchText, setSearchText] = useState(""); // State for search text
  //helpers
  const handleAddProductModal = () => {
    setIsAddProductModalOpen(!isAddProductModalOpen);
  };
  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleEditProductModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const createProdcut = async () => {};
  const deleteProductCall = async () => {
    const id = localStorage.getItem("selected_value");
    loadingDispatch({
      type: "SET_LOADING",
    });
    try {
      await productsService.deleteProduct(id);
      productDispatch({
        type: "DELETE_PRODUCT",
        payload: {
          id: id,
        },
      });
      inventoryDispatch({
        type: "GET_ENTRIES",
        payload: {
          entries: inventoryState.entries.filter(
            (entry) => entry.productId !== id
          ),
        },
      });
    } catch (error) {
      setErrorFun(error);
    }
    loadingDispatch({
      type: "SET_NOT_LOADING",
    });
    setDeleteConfirmOpen(!deleteConfirmOpen);
  };
  const handleViewProductModal = () => {
    setViewModalOpen(!viewModalOpen);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const products = () => {
    if (searchText.length !== 0) {
      return productState.products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return productState.products;
  };

  useEffect(() => {
    loadingDispatch({
      type: "SET_LOADING",
    });
    productsService
      .getAllProducts()
      .then((res) => {
        productDispatch({
          type: "GET_PRODUCTS",
          payload: {
            products: res,
          },
        });
      })
      .catch((err) => {
        setErrorFun(`${err}`);
      });
    loadingDispatch({
      type: "SET_NOT_LOADING",
    });
  }, []);

  return (
    <Container className="nav-bar-container">
      <BodyTitles
        title={"Products"}
        onClick={() => {
          setSelectedItem(null);
          handleAddProductModal();
        }}
        onDownloadClicked={() => {
          navigate("/pdf-products");
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          margin: "16px 0",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="body-body">
        <CommonTable
          data={products()}
          headers={["name", "instock_amount", "last_stock_filled", "price"]}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          primaryFieldName={"id"}
          onPageChange={() => {}}
          editFunc={() => {
            handleEditProductModal();
          }}
          deleteFunc={() => {
            setDeleteConfirmOpen(true);
          }}
        />

        <Pagination
          count={Math.ceil(products().length / itemsPerPage)}
          page={currentPage}
          onChange={(event, newPage) => onPageChange(newPage)}
        />
        <AddProduct
          open={isAddProductModalOpen}
          handleOpenClose={handleAddProductModal}
          onSubmit={createProdcut}
        />
        <AddProduct
          open={isEditModalOpen}
          handleOpenClose={handleEditProductModal}
          onSubmit={createProdcut}
          defaultValues={selectedItem}
        />
        <ConfirmationDialog
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(!deleteConfirmOpen);
          }}
          onConfirm={deleteProductCall}
          title={"Do you want to delete this product ?"}
          message={""}
        />
        <ViewProduct
          open={viewModalOpen}
          handleClose={handleViewProductModal}
        />
      </div>
    </Container>
  );
};

export default Products;
