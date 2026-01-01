import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDamageReportContext } from "../context";
import { useNavigate, useParams } from 'react-router';

export const DamageTypeSelector = () => {
    const { damageTypes } = useDamageReportContext();
    const { type } = useParams();
    const navigate = useNavigate();

    const types = Object.keys(damageTypes);

    const hangleChange = (
        event: React.MouseEvent<HTMLElement>,
        type: string | null
    ) => {
        if (type) {
            navigate(`/damagereport/${type}`)
        }
    }

    const buttons = types.map(name => (
        <ToggleButton value={name} key={name}>
            {name}
        </ToggleButton>
    ))
    return (
        <ToggleButtonGroup
            sx={{ alignSelf: 'end', marginLeft: 'auto' }}
            size="small"
            exclusive
            value={type || types[0]}
            onChange={hangleChange}
        >
            {buttons}
        </ToggleButtonGroup>
    )
}