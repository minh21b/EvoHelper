import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { lightBlue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useMemo, useState } from 'react';
import { DependencyObj, getItemArrFlatDependenciesObject } from '../../../util/crafting';
import { useItemContext } from '../../../contexts/itemsContext';
import { ItemIconAndTitle } from './ItemIconAndTitle';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export interface CraftingProgressProps {
  targets: string[];
  owned: string[];
  title?: string;
}

export const CraftingProgress = ({
  targets,
  owned,
  title = 'Crafting Progress',
}: CraftingProgressProps) => {
  const {items} = useItemContext();
  const [expanded, setExpanded] = useState(false);

  const [missing] = useMemo(() =>{
    if (!targets?.length || !owned || !items){
      return [{} as DependencyObj];
    }
    return getItemArrFlatDependenciesObject(
      targets,
      owned,
      items
    );
  }, [targets, owned, items]);

  const hasMissing = Object.keys(missing).length >0;
  if (!hasMissing){
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography>{title}</Typography>
        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(p=> !p)}
          aria-expanded={expanded}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {Object.keys(missing).map((key) => (
          <MissingItem
            key={key}
            id={key}
            amount={missing[key]}
          />
        ))}
      </Collapse>
      <Divider sx={{mt:1, mb:1}} />
    </>
  );
};



function MissingItem(props: {id:string; amount:number}) {
  const {id, amount} = props;
  const {items} = useItemContext();
  const item = items[id];

  if (!item){
    return (
      <Typography>
        {amount} x {id}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Typography sx={{width: '30px'}}>
          {amount}
        </Typography>
        <ItemIconAndTitle item={item}/>
      </Box>
      {item.sourceShort && (
        <Typography
          variant = 'body2'
          sx={{color: lightBlue[300], lineHeight: '40px'}}
        >
          {item.sourceShort}
        </Typography>
      )}
    </Box>
  );
}