import React, { useEffect, useState } from "react";
import { Container, Pagination, Tab, Tabs } from "@mui/material";
import { useLoading } from "../store/loading_store";
import { useErrorContext } from "../store/error_store";
import { useInventoryContext } from "../store/inventory_store";
import { useProductsContext } from "../store/product_store";
import BodyTitles from "../components/BodyTitles";
import CommonTable from "../components/CommonTable";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InventoryService from "../services/InventoryService";
import { db } from "../firebaseConfig";
import AddInventoryEntry from "../modals/AddInventoryEntry";
import { useSelectedItemContext } from "../store/selected_item_store";
import { dateGenerator } from "../services/date_generater";

const Inventories = () => {
  const inventoryService = new InventoryService(db);
  const itemsPerPage = 10;

  // Contexts
  const { loadingDispatch } = useLoading();
  const { setErrorFun } = useErrorContext();
  const { inventoryState, inventoryDispatch } = useInventoryContext();
  const { selectedItem } = useSelectedItemContext();
  const { productState } = useProductsContext();
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [editStockModalOpen, setEditStockModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs, setTabs] = useState([]);
  // Event Handlers
  const handleAddStockModal = () => {
    setAddStockModalOpen(!addStockModalOpen);
  };

  const handleEditStockModal = () => {
    setEditStockModalOpen(!editStockModalOpen);
  };

  const handleViewStockModal = () => {
    setViewModalOpen(!viewModalOpen);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const deleteStockEntry = async () => {
    console.log(selectedItem.id);
    await inventoryService
      .deleteInventies(selectedItem.id)
      .catch((err) => setErrorFun(`${err}`));
    inventoryDispatch({
      type: "DELETE_ENTRY",
      payload: {
        id: selectedItem.id,
      },
    });
    setDeleteConfirmOpen(false);
  };
  const getProducts = async () => {
    loadingDispatch({
      type: "SET_LOADING",
    });
    inventoryService
      .getInventories()
      .then((res) => {
        let entries = [];
        res.forEach((entry) => {
          const product = productState.products.find((p) => {
            return p.id === entry.productId;
          });

          const d = {
            product: product.name,
            ...entry,
          };
          entries.push(d);
        });
        inventoryDispatch({
          type: "GET_ENTRIES",
          payload: { entries: entries },
        });
      })
      .catch((err) => {
        setErrorFun(err);
      });
    loadingDispatch({
      type: "SET_NOT_LOADING",
    });
  };
  useEffect(() => {
    setTabs(dateGenerator(7));
    getProducts();
  }, []);

  return (
    <Container className="nav-bar-container">
      <BodyTitles
        title={"Inventories"}
        onClick={() => {
          handleAddStockModal();
        }}
      />
      <div className="body-body">
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Tabs
            onChange={(e, newValue) => {
              setSelectedTab(newValue);
            }}
            variant="scrollable"
            value={selectedTab}
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab label={tab} />
            ))}
          </Tabs>
        </div>

        <CommonTable
          data={inventoryState.entries.filter(
            (product) => product.date === tabs[selectedTab]
          )}
          headers={["product", "quantity"]}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          primaryFieldName={"id"}
          onPageChange={onPageChange}
          deleteFunc={() => {
            setDeleteConfirmOpen(true);
          }}
        />

        <Pagination
          count={Math.ceil(inventoryState.entries.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, newPage) => onPageChange(newPage)}
        />

        <AddInventoryEntry
          open={addStockModalOpen}
          handleOpenClose={() => {
            setAddStockModalOpen(false);
          }}
          getProducts={getProducts}
        />

        <ConfirmationDialog
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(!deleteConfirmOpen);
          }}
          onConfirm={deleteStockEntry}
          title={"Do you want to delete this stock entry?"}
          message={""}
        />
      </div>
    </Container>
  );
};

export default Inventories;
