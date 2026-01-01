import { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useCharacterContext } from '../contexts/characterContext';
import { EvoStash } from '../components/Stash';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import { GodlyProgress } from '../feature/item/components/GodlyProgress';
import { getItemArrFlatDependenciesObject } from '../util/crafting';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { TItem } from '../../types';
import { useMemo } from 'react';
import { CraftingProgress } from '../feature/item/components/CraftingProgress';
import {canEquipItem} from '../../main/util/itemEquip';

export const CharacterPage: FC = () => {
  const { getCharacter, onLoadClick } = useCharacterContext();
  const { accountURL, id } = useParams();

  const [allItems, setAllItems] = useState<TItem[]>([]);
  const [plannedItems, setPlannedItems] = useState<string[]>([]);

  const character = getCharacter(accountURL, id);
  if (!accountURL || !id || !character) return null;

  const ownedItems = [...character.inventory, ...character.stashes.flat()];
  const items = character ? [...character.inventory, ...character.stashes.flat()] : null;

  //only godly/forged/mythic items in the item planner
  // const plannerItems = useMemo(
  //   () => allItems.filter(item => item.rarity?.id >= 6),
  //   [allItems]
  // );
  const plannerItems = useMemo(() => {
    return allItems.filter(item =>
      item.rarity?.id >= 7 &&
      canEquipItem(character.hero, item)
    );
  }, [allItems, character.hero]);
  const MAX_PLANNED_ITEMS = 5;

  // Load all items
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get_all_items');

    const unsubscribe = window.electron.ipcRenderer.once(
      'get_all_items',
      (itemsDict: Record<string, TItem>) => {
        setAllItems(Object.values(itemsDict));
      }
    );
    return unsubscribe;
  }, []);

  // Load planned build per character
  useEffect(() => {
    if (!accountURL || !id) return;
    window.electron.ipcRenderer.sendMessage('settings_read');

    const unsubscribe = window.electron.ipcRenderer.once('settings_read', (settings: any) => {
      const key = `${accountURL}:${id}`;
      const savedPlan = settings?.plannedBuilds?.[key];
      if (Array.isArray(savedPlan)) setPlannedItems(savedPlan);
    });

    return unsubscribe;
  }, [accountURL, id]);

  // Save build planner
  useEffect(() => {
    if (!accountURL || !id) return;
    const key = `${accountURL}:${id}`;

    window.electron.ipcRenderer.sendMessage('settings_read');
    window.electron.ipcRenderer.once('settings_read', (settings: any) => {
      const updatedSettings = {
        ...settings,
        plannedBuilds: {
          ...(settings?.plannedBuilds ?? {}),
          [key]: plannedItems,
        },
      };
      window.electron.ipcRenderer.sendMessage('settings_write', updatedSettings);
    });
  }, [plannedItems, accountURL, id]);

  return (
    <div>
      <IconButton style={{ left: -10 }} component={Link} to={`/characters/${accountURL}`}>
        <ArrowBackIcon />
        <Typography variant="caption">Go back</Typography>
      </IconButton>

      <Typography variant="h6">
        {character.hero} {character.level && ` - ${character.level} level`}
      </Typography>
      <Typography variant="caption">Gold: {character.gold}</Typography>
      <br />
      <Typography variant="caption">Shards: {character.powerShards}</Typography>
      {character.notes && (
        <>
          <br />
          <Typography variant="caption">Mysterious Notes: {character.notes}</Typography>
        </>
      )}
      {character.sigils && (
        <>
          <br />
          <Typography variant="caption">Mysterious Sigils: {character.sigils}</Typography>
        </>
      )}
      {character.orbs && (
        <>
          <br/>
          <Typography variant="caption">Mysterious Orbs: {character.orbs}</Typography>
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <Box sx={{ mr: 2 }}>
            <EvoStash itemIds={character.inventory} />
          </Box>
          {character.stashes.map((stash, idx) => (
            <EvoStash itemIds={stash} key={idx} />
          ))}
        </Box>

        <Box sx={{minWidth: 250}}>
          <Typography variant="h8">Items Planner</Typography>
          <Autocomplete
            multiple
            options={plannerItems.map((i)=> i.id)}
            value={plannedItems}
            onChange={(event, newValue) => {
              let limitedValue = newValue;
              if (newValue.length > MAX_PLANNED_ITEMS){
                limitedValue = newValue.slice(0, MAX_PLANNED_ITEMS);
              }
              setPlannedItems(limitedValue);
            }}
            getOptionLabel={(id) => plannerItems.find((i) => i.id === id)?.name ??id}
            renderTags={(value, getTagProps) =>
              value.map((id, index)=>{
                const item = plannerItems.find((i)=> i.id ===id);
                const {key, ...otherProps} = getTagProps({index});
                return (
                  <Chip
                    key={id}
                    label={item?.name ??id}
                    {...otherProps}
                    size="small"
                  />
                );
              })
            }
            renderInput={(params) => <TextField {...params} label="Items Planner"/>}
            disableCloseOnSelect
            sx={{mt:1, width: 'auto', minWidth:200, maxWidth:320}}
          />
        </Box>
      </Box>

      <Divider sx={{ mt: 3, mb: 2 }} />

      {/* Godly Progress */}
      {items && <GodlyProgress itemIdsList={items} />}

      {/* Crafting Progress */}
      {plannedItems.length > 0 && (
        <CraftingProgress targets={plannedItems} owned={ownedItems} title="Build Progress" />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
        <Button variant="contained" onClick={() => onLoadClick(character)}>
          Load
        </Button>
        <Tooltip
          sx={{ marginLeft: '15px' }}
          title={
            <Box>
              <Typography variant="body2">
                Press Load - it will set hotkey for A button.
              </Typography>
              <Typography variant="body2">Head to wc3 and press A.</Typography>
              <Typography variant="body2">Let it do its thing.</Typography>
              <Typography variant="caption">
                Tip: remember to turn off caps lock and switch to English
              </Typography>
            </Box>
          }
        >
          <InfoIcon color="primary" />
        </Tooltip>
      </Box>
    </div>
  );
};
