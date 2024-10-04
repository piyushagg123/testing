import React, { createContext, useState, ReactNode } from "react";

interface UserDetails {
  email: string;
  first_name: string;
  is_vendor: boolean;
  last_name: string;
  mobile: string;
  user_id: number;
  vendor_id: number;
}

interface AuthContextType {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
  showBanner: boolean;
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
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
  user_id: 0,
  vendor_id: 0,
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [login, setLogin] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [userDetails, setUserDetails] =
    useState<UserDetails>(defaultUserDetails);

  return (
    <AuthContext.Provider
      value={{
        login,
        setLogin,
        userDetails,
        setUserDetails,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
