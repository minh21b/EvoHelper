import { FC } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { lightBlue } from '@mui/material/colors';
import { TItem } from '../../types';

const ItemCard: FC<{ item: TItem; id: string }> = ({ item, id }) => {
  const { color } = item.rarity;
  return (
    <>
      {/* using id itself for debugging purposes */}
      <Typography variant="subtitle2" color={color}>
        {id}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" color={lightBlue[300]}>
        {item.restriction}
      </Typography>
      {item.description && (
        <Typography variant="body2">{item.description}</Typography>
      )}
      {item.description && item.effects.length > 0 && <Divider />}
      {item.effects.map((effect, index) => (
        <Typography key={effect + index} variant="body1">
          {effect}
        </Typography>
      ))}
    </>
  );
};

export default ItemCard;
