import { createContext, useContext, useReducer } from "react";

const InventoryContext = createContext();

const initialState = {
  entries: [],
};

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case "GET_ENTRIES":
      return { ...state, entries: action.payload.entries };
    case "ADD_ENTRY":
      return {
        ...state,
        entries: [...state.entries, action.payload.entry],
      };
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter(
          (entry) => entry.id !== action.payload.id
        ),
      };
    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((product) =>
          product.productId === action.payload.productId &&
          product.date === action.payload.updatedProduct.date
            ? { ...product, ...action.payload.updatedProduct }
            : product
        ),
      };
    default:
      return state;
  }
};

export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);
  return (
    <InventoryContext.Provider
      value={{ inventoryState: state, inventoryDispatch: dispatch }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  return useContext(InventoryContext);
};
