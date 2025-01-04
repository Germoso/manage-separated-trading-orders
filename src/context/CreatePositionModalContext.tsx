import React, { createContext, useState, ReactNode } from 'react';

interface CreatePositionModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DEFAULT_VALUE: CreatePositionModalContextProps = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

export const CreatePositionModalContext = createContext<CreatePositionModalContextProps>(DEFAULT_VALUE);

export const CreatePositionModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <CreatePositionModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </CreatePositionModalContext.Provider>
  );
};
