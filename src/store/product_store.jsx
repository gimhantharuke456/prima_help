import { createContext, useContext, useReducer } from "react";

const ProductsContext = createContext();

const initialState = {
  products: [],
};

const productsReducer = (state, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return { ...state, products: action.payload.products };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.updatedProduct }
            : product
        ),
      };
    case "CREATE_PRODUCT":
      return {
        products: [...state.products, action.payload.product],
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
};

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  return (
    <ProductsContext.Provider
      value={{ productState: state, productDispatch: dispatch }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  return useContext(ProductsContext);
};
