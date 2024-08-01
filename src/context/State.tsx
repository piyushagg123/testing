import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
type StateType = any[];
interface StateContextType {
  state: StateType;
  setState: Dispatch<SetStateAction<StateType>>;
}
const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProviderProps {
  children: ReactNode;
}

const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, setState] = useState<StateType>([]);

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
