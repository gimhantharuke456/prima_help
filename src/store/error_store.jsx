import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("");
  const setErrorFun = (err) => {
    setError(err);
  };
  return (
    <ErrorContext.Provider value={{ error, setErrorFun }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  return useContext(ErrorContext);
};
