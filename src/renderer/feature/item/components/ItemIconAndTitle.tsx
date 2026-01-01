import Box, { BoxProps } from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { iconFromId } from '../../../icons/icons';
import { grey } from '@mui/material/colors';

import { TItem } from '../../../../types';
import { FC } from 'react';

interface Props extends BoxProps {
    item: TItem
}

export const ItemIconAndTitle: FC<Props> = (props) => {
    const { item, sx, ...rest } = props;
    return (
      <Box sx={{ display:'flex', flexDirection:'row', alingItems: 'center', ...sx }} {...rest}>
        <Avatar sx={{ bgcolor: grey[500], marginRight: '10px', verticalAlign: 'middle' }} variant="rounded" src={iconFromId(item.icon)}/>
        <Typography variant="body2" sx={{ color: item.rarity.color, lineHeight: '40px' }}>{item.id}</Typography>
      </Box>
    )
  }