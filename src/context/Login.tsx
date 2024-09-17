import React, { createContext, useState, ReactNode } from "react";

interface UserDetails {
  email: string;
  first_name: string;
  is_vendor: boolean;
  last_name: string;
  mobile: string;
}

interface DecodedJWT {
  user_id: number;
  vendor_id: number;
  exp: number;
}

interface AuthContextType {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
  decodeJWT: DecodedJWT | undefined;
  setDecodedJWT: React.Dispatch<React.SetStateAction<DecodedJWT | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const defaultUserDetails: UserDetails = {
  email: "",
  first_name: "",
  is_vendor: false,
  last_name: "",
  mobile: "",
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [login, setLogin] = useState<boolean>(false);
  const [userDetails, setUserDetails] =
    useState<UserDetails>(defaultUserDetails);

  const [decodeJWT, setDecodedJWT] = useState<DecodedJWT>();

  return (
    <AuthContext.Provider
      value={{
        login,
        setLogin,
        userDetails,
        setUserDetails,
        decodeJWT,
        setDecodedJWT,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
