import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../services/check_auth_service";

const AuthContext = createContext();

export const AuthProvicer = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkLogin = async () => {
    setIsAuthenticated(await checkAuth());
  };
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
