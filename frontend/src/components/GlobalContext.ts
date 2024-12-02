import React from 'react';

export interface GlobalContextProps {
  folderPath: string;
  setFolderPath: (path: string) => void;
}

const GlobalContext = React.createContext<GlobalContextProps | undefined>(undefined);
export default GlobalContext;