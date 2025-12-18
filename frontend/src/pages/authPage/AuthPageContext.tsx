import React, { createContext, useState, useContext } from 'react';

// 1. Define the Shape of your Context
interface StateContextType {
  toggleAuthPage: "signUp" | "login";
  setToggleAuthPage: React.Dispatch<React.SetStateAction<"signUp" | "login">>;
  handleToogleAuthPage: (page: "signUp" | "login") => void;
}


const StateContext = createContext<StateContextType | undefined>(undefined);


interface StateProviderProps {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: StateProviderProps) => {
  const [toggleAuthPage, setToggleAuthPage] = useState<"signUp" | "login">("signUp");

  function handleToogleAuthPage(page: "signUp" | "login") {
    console.log("click");
    setToggleAuthPage(page);
  }


  const value = {
    toggleAuthPage,
    setToggleAuthPage,
    handleToogleAuthPage,
  };

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};


export const useAuthPageState = () => {
  const context = useContext(StateContext);


  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }

  return context;
};