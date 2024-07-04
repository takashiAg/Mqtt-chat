import React, { createContext, useContext, useState, ReactNode } from "react";

// グローバルステートの型を定義
interface GlobalState {
  userId: string | null;
  isLogined: boolean;
}

// コンテキストを作成
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);
const GlobalUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<GlobalState>> | undefined
>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalState>({
    userId: null,
    isLogined: false,
  });

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalUpdateContext.Provider value={setState}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalStateContext.Provider>
  );
};
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

export const useGlobalUpdate = (): React.Dispatch<
  React.SetStateAction<GlobalState>
> => {
  const context = useContext(GlobalUpdateContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalUpdate must be used within a GlobalStateProvider"
    );
  }
  return context;
};
