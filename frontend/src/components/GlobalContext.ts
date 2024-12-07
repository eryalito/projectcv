import React from 'react';

export interface GlobalContextProps {
  folderPath: string;
  setFolderPath: (path: string) => void;
}

const GlobalContext = React.createContext<GlobalContextProps>({
  folderPath: "",
  setFolderPath: () => {},
});
export default GlobalContext;