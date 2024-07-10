import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [joinAsPro, setJoinAsPro] = useState(false);
  const [vendor, is_vendor] = useState(false);
  const [state, setState] = useState([]);

  return (
    <AuthContext.Provider
      value={{
        login,
        setLogin,
        joinAsPro,
        setJoinAsPro,
        userDetails,
        setUserDetails,
        projectId,
        setProjectId,
        vendor,
        is_vendor,
        state,
        setState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
