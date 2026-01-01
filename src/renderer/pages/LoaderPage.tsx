import { useCharacterContext } from '../contexts/characterContext';
import { useSettingsContext } from '../contexts/settingsContext';
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { CharactersList } from '../components/CharactersList';

export function LoaderPage() {
  const { accountsDict: allClasses } = useCharacterContext();
  const navigate = useNavigate();
  const { battleTag, multipleAccounts } = useSettingsContext();

  const { accountURL } = useParams();

  const selectedAccount = useMemo( () => {
    const formattedAccount = accountURL?.replace('$', '#');
    if (Object.keys(allClasses).length === 0) {
      return "";
    }

    if (formattedAccount && allClasses.hasOwnProperty(formattedAccount)) {
      return formattedAccount;
    }

    if (battleTag && allClasses.hasOwnProperty(battleTag)) {
      return battleTag;
    }

    return Object.keys(allClasses)[0];
  }, [accountURL, allClasses, battleTag]);

  const selectedAccountClasses = useMemo(() => {
    if (!selectedAccount || !allClasses.hasOwnProperty(selectedAccount)) {
      return [];
    }

    return allClasses[selectedAccount];
  }, [selectedAccount, allClasses]);

  const onAccountSelect = (account: string) => {
    // i hate # in urls...
    navigate(`/characters/${account.replace('#', '$')}`);
  }

  if (!selectedAccount) {
    return null;
  }

  return (
    <>
      {(Object.keys(allClasses).length > 1) && multipleAccounts && (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="account-selector-label">Account</InputLabel>
          <Select
            labelId="account-selector-label"
            value={selectedAccount}
            label="Account"
            onChange={(e) => onAccountSelect(e.target.value)}
          >
            {
              Object.keys(allClasses).map((acc) => (
                <MenuItem key={acc} value={acc}>{acc}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      )}
      <CharactersList
        list={selectedAccountClasses}
        accountURL={selectedAccount.replace('#', '$')}
      />
    </>
  );
}
