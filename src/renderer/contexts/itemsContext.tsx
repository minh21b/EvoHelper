import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { TItem } from "../../types"

interface ItemsContext {
    items: {
        [key: string]: TItem
    }
}

export const ItemsContext = createContext({} as ItemsContext);

export const ItemsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [items, setItems] = useState({});
    // calling it once for now
    useEffect(() => {
        window.electron.ipcRenderer.on('get_all_items', (arg: any) => {
            // trusting this one
            //console.log('IPC received items:', arg);
            setItems(arg);
          });
          window.electron.ipcRenderer.sendMessage('get_all_items');
    }, []);

    return (
        <ItemsContext.Provider value={{items}}>
            {children}
        </ItemsContext.Provider>
    )
}

export const useItemContext = () => useContext(ItemsContext);