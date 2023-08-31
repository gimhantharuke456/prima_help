import React from "react";
import { useAuth } from "../store/auht_store";
import Login from "../views/Login";
import { useLoading } from "../store/loading_store";
import Loading from "./Loading";
import { useErrorContext } from "../store/error_store";
import { Alert } from "@mui/material";
import Dashboard from "../views/Dashboard";

const ComponentContainer = () => {
  const { isAuthenticated } = useAuth();
  const { loadingState } = useLoading();

  if (loadingState.isLoading == true) {
    return <Loading />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
};

export default ComponentContainer;
