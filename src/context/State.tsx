import { createContext, useState } from "react";

const StateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StateContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, StateContext };
