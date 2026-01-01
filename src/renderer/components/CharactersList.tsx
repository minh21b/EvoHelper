import Box from '@mui/material/Box';
import { CharacterCard } from './CharacterCard';
import { useMemo } from 'react';
import { useSettingsContext } from '../contexts/settingsContext';
import { IClassLoad } from '../../types';
import { useCharacterContext } from '../contexts/characterContext';

interface CharactersListProps {
  list: IClassLoad[],
  accountURL: string,
}

export function CharactersList({accountURL, list }: CharactersListProps) {
  const { onlyT4Classes, favouriteClasses } = useSettingsContext();
  const { tier4ClassesList } = useCharacterContext();
  const favouriteClassList = useMemo(() => {
    return list.filter((character) => {
        const filteredByT4 = onlyT4Classes && !tier4ClassesList.includes(character.hero);
        const isFavourite = favouriteClasses.includes(character.hero);
        return isFavourite && !filteredByT4
      }
    );
  }, [list, onlyT4Classes, favouriteClasses]);

  const restClassesList = useMemo(() => {
      return list.filter((character) => {
          const filteredByT4 = onlyT4Classes && !tier4ClassesList.includes(character.hero);
          const isFavourite = favouriteClasses.includes(character.hero);
          return !isFavourite && !filteredByT4
        }
      );
    }, [list, onlyT4Classes, favouriteClasses]
  )
  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: '30px' }}>
        {favouriteClassList.map((character) => (
          <CharacterCard
            key={`${character.hero}_${character.level}`}
            character={character}
            favourite={true}
            accountURL={accountURL}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {restClassesList.map((character) => (
          <CharacterCard
            key={`${character.hero}_${character.level}`}
            character={character}
            accountURL={accountURL}
          />
        ))}
      </Box>
    </Box>
  )
}