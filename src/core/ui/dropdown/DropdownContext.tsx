import { createContext } from 'react';

export type DropdownContextValue = {
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
};

export const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);
