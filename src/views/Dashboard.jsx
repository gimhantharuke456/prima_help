import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box } from "@mui/system";
import { Route, BrowserRouter as Router, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Users from "./Users";
import Products from "./Products";
import Inventories from "./Inventories";
import { Alert } from "@mui/material";
import { useErrorContext } from "../store/error_store";

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(
    Number(localStorage.getItem("actinve_index")) ?? 0
  );
  const { error } = useErrorContext();
  const activeIndexHandler = (index) => {
    localStorage.setItem("actinve_index", index);
    setActiveIndex(Number(localStorage.getItem("actinve_index")));
  };

  const stylesHandler = (index) => {
    if (activeIndex === index) {
      return {
        backgroundColor: "#5A5A5A",
        color: "white",
        transitionDuration: "0.8s",
      };
    }
    return {};
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
          open={true}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          ></Toolbar>
          <Divider />
          <List>
            <Link
              to="/"
              onClick={() => {
                activeIndexHandler(0);
              }}
            >
              <ListItem button style={stylesHandler(0)}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            <Link
              to="/products"
              onClick={() => {
                activeIndexHandler(1);
              }}
            >
              <ListItem button style={stylesHandler(1)}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>
            </Link>
            <Link
              to="/invetories"
              onClick={() => {
                activeIndexHandler(2);
              }}
            >
              <ListItem button style={stylesHandler(2)}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Inventories" />
              </ListItem>
            </Link>
            <Link
              to="/admins"
              onClick={() => {
                activeIndexHandler(3);
              }}
            >
              <ListItem button style={stylesHandler(3)}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Admins" />
              </ListItem>
            </Link>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            width: "100%",
            padding: "16px",
            paddingTop: 12,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <div
            style={{
              width: "100%",
              height: `calc(100vh - 200px)`,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/invetories" element={<Inventories />} />
              <Route path="/admins" element={<Users />} />
            </Routes>
          </div>
        </Box>
      </Box>
    </Router>
  );
};

export default Dashboard;
