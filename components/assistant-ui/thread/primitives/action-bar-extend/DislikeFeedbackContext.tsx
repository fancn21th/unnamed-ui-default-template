"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DislikeFeedbackContextValue {
  isOpen: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
}

const DislikeFeedbackContext = createContext<DislikeFeedbackContextValue | undefined>(undefined);

export const useDislikeFeedback = () => {
  const context = useContext(DislikeFeedbackContext);
  if (!context) {
    throw new Error("useDislikeFeedback must be used within DislikeFeedbackProvider");
  }
  return context;
};

export const DislikeFeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openFeedback = () => setIsOpen(true);
  const closeFeedback = () => setIsOpen(false);

  return (
    <DislikeFeedbackContext.Provider value={{ isOpen, openFeedback, closeFeedback }}>
      {children}
    </DislikeFeedbackContext.Provider>
  );
};

