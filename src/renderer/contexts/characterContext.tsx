import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSettingsContext } from './settingsContext';
import { IClassLoad } from '../../types';

const WC3_CHUNK_SIZE = 120;

/**
 * 
 * @param loadCode The raw TEVE load code saved in wc3 documents.
 * @returns An array of strings, each containing a chunk of the load code. Handles load codes no matter the length.
 */
function splitIntoChunks(loadCode: string): string[] {
  const result: string[] = [];
    
  for (let i = 0; i < loadCode.length; i += WC3_CHUNK_SIZE) {
      result.push(loadCode.slice(i, i + WC3_CHUNK_SIZE));
  }
  
  return result;
}

interface CharacterContext {
  classesList: string[];
  tier4ClassesList: string[];
  accountsDict: {[account: string]: IClassLoad[]};
  setAccountsDict: (classes: {[account: string]: IClassLoad[]}) => void;
  onLoadClick: (character: IClassLoad, legacy?: boolean) => void;
  loadClasses: () => void;
  getCharacter: (account?: string, id?: string) => IClassLoad | undefined;
}

export const CharacterContext = createContext({} as CharacterContext);

export const CharacterProvider: FC<PropsWithChildren> = ({ children }) => {
  const { wc3path, extraLines } = useSettingsContext();
  const [accountsDict, setAccountsDict] = useState<{[account: string]: IClassLoad[]}>({});
  const [classesList, setClassesList] = useState<Array<{ name: string, tier: number }>>([]);
  const loadClasses = () => {
    window.electron.ipcRenderer.sendMessage(
      'loadData',
      // probably should get rid of contant path parts in 'frontend'
      [
        wc3path,
        'CustomMapData',
        "Twilight's Eve Evo"
      ]
    );
  };
  const getCharacter = (account?: string, id?: string) => {
    if (!account || !id) {
      return undefined;
    }
    const formattedAccount = account.indexOf('$') !== -1 ? account.replace('$', '#') : account;

    return accountsDict[formattedAccount]?.find((character) => character.hero === id);
  };
  const onLoadClick = (character: IClassLoad, legacy?: boolean) => {
    if (character && character.code) {
      const loadCodeChunks = splitIntoChunks(character.code);

      window.electron.ipcRenderer.sendMessage(
        'load',
        [
          '-rp',
          '-lc',
          ...loadCodeChunks,
          '-le',
          ...extraLines.split('\n'),
        ],
        legacy,
      );
    }
  };
  const value = {
    classesList: classesList.map(e => e.name),
    tier4ClassesList: classesList.filter(e => e.tier === 4).map(e => e.name),
    accountsDict,
    setAccountsDict,
    onLoadClick,
    loadClasses,
    getCharacter,
  };
  useEffect(() => {
    window.electron.ipcRenderer.on('loadData', (arg: any) => {
      // @ts-ignore
      setAccountsDict(arg);
    })

    window.electron.ipcRenderer.on('get_all_classes', (arg: any) => {
      // trusting this one
      setClassesList(arg);
    });
    window.electron.ipcRenderer.sendMessage('get_all_classes');

  }, []);

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};
export const useCharacterContext = () => useContext(CharacterContext);
