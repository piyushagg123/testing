import React, { createContext, useState, ReactNode } from "react";

interface ApiContextType {
  errorInApi: boolean;
  setErrorInApi: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [errorInApi, setErrorInApi] = useState<boolean>(false);

  return (
    <ApiContext.Provider
      value={{
        errorInApi,
        setErrorInApi,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export { ApiProvider, ApiContext };
