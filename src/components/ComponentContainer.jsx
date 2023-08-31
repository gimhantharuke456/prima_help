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
  const { error } = useErrorContext();
  if (loadingState.isLoading == true) {
    return <Loading />;
  }
  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
};

export default ComponentContainer;
