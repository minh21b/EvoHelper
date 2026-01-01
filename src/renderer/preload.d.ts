import { ElectronHandler } from '../../../electron-typescript-react-mui/src/main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}

export {};
