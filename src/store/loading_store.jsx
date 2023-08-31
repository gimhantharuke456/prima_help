import React, { createContext, useContext, useReducer } from "react";

const LoadingContext = createContext();

const initialState = {
  isLoading: false,
};

const loadingReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: true };
    case "SET_NOT_LOADING":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  return (
    <LoadingContext.Provider
      value={{ loadingState: state, loadingDispatch: dispatch }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
