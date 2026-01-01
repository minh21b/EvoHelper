import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts/settingsContext';

export function LastRunInfoPage() {
  const { wc3path } = useSettingsContext();
  const [info, setInfo] = useState('');
  useEffect(() => {
    window.electron.ipcRenderer.on('last_run_info', (arg: any) => {
      setInfo(arg);
    });
    window.electron.ipcRenderer.sendMessage('request_last_run', wc3path);
  }, [wc3path]);
  return (
    <Paper sx={{
      padding: '15px',
      whiteSpace: 'pre-line',
    }}>
      {info}
    </Paper>
  )
}