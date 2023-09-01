import React, { useEffect, useState } from "react";
import {
  Container,
  Pagination,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
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
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("week");
  // Event Handlers
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };
  const filteredTabs = () => {
    const today = new Date();
    switch (selectedFilter) {
      case "week":
        return dateGenerator(7);
      case "two-weeks":
        return dateGenerator(14);
      case "month":
        return dateGenerator(30);
      case "two-months":
        return dateGenerator(60);
      default:
        return dateGenerator(7);
    }
  };
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
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
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
  const inventries = () => {
    if (searchText.length != 0) {
      return inventoryState.entries.filter(
        (product) =>
          product.date === tabs[selectedTab] &&
          product.product.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return inventoryState.entries.filter(
      (product) => product.date === tabs[selectedTab]
    );
  };
  useEffect(() => {
    setTabs(dateGenerator(7));
    getProducts();
  }, []);
  useEffect(() => {
    setTabs(filteredTabs());
    getProducts();
  }, [selectedFilter]);
  return (
    <Container className="nav-bar-container">
      <BodyTitles
        title={"Inventories"}
        onClick={() => {
          handleAddStockModal();
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
        <Select
          value={selectedFilter}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          style={{ marginLeft: "8px" }}
        >
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="two-weeks">Two Weeks</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="two-months">Two Months</MenuItem>
        </Select>
      </div>
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
          data={inventries()}
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
          count={Math.ceil(inventries().length / itemsPerPage)}
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
