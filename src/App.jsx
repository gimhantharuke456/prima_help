import { useEffect } from "react";
import Login from "./views/Login";
import { AuthProvicer } from "./store/auht_store";
import ComponentContainer from "./components/ComponentContainer";
import { LoadingProvider } from "./store/loading_store";
import { ErrorProvider } from "./store/error_store";
import Dashboard from "./views/Dashboard";
import { UserProvider } from "./store/user_store";
import { ProductsProvider } from "./store/product_store";
import { SelectedItemProvider } from "./store/selected_item_store";
import { InventoryProvider } from "./store/inventory_store";

function App() {
  return (
    <>
      <AuthProvicer>
        <LoadingProvider>
          <ErrorProvider>
            <UserProvider>
              <ProductsProvider>
                <SelectedItemProvider>
                  <InventoryProvider>
                    <ComponentContainer />
                  </InventoryProvider>
                </SelectedItemProvider>
              </ProductsProvider>
            </UserProvider>
          </ErrorProvider>
        </LoadingProvider>
      </AuthProvicer>
    </>
  );
}

export default App;
