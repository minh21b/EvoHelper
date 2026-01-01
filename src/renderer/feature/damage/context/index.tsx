import { createContext, FC, PropsWithChildren, useEffect, useContext, useState } from "react";
import { IDamagePerPlayer } from "../../../../types";

interface IDamageReport {
    dungeonName: string;
    damageTypes: {
        [damageType: string]: IDamagePerPlayer
    }
}

const initialValue = {
    dungeonName: "Damage report",
    damageTypes: {}
} as IDamageReport;

export const DamageReportContext = createContext(initialValue);

export const DamageProvider: FC<PropsWithChildren> = ({ children }) => {
    const [damageReport, setDamageReport] = useState<IDamageReport>(initialValue);

    useEffect(() => {
        const listener = window.electron.ipcRenderer.on('get_latest_damage_by_type', (arg: any) => {
            setDamageReport(arg);
        });

        window.electron.ipcRenderer.sendMessage('get_latest_damage_by_type');
    }, []);

    return (
        <DamageReportContext.Provider value={damageReport}>
            {children}
        </DamageReportContext.Provider>
    )
}

export const useDamageReportContext = () => useContext(DamageReportContext);
