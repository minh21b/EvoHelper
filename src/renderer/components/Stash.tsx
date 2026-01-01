import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material';
import { CompactItem } from './CompactItem';

interface EvoStashProps extends BoxProps {
  itemIds: string[];
}

export function EvoStash(props: EvoStashProps) {
  const { itemIds, ...rest } = props;
  return (
    <Box {...rest}>
      {itemIds.map((id, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CompactItem key={id + index} id={id} />
      ))}
    </Box>
  );
};
