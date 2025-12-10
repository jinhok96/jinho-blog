import { createContext } from 'react';

export type DropdownContextValue = {
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
};

export const dropdownContext = createContext<DropdownContextValue | undefined>(undefined);
