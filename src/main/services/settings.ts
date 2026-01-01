import path from 'path';
import fs from 'fs/promises';

export function createSettingsService (getPath: (type: 'userData' | 'documents') => string) {
    const getDefaultSettings = () => {
        return {
            wc3path: path.join(getPath('documents'), 'Warcraft III'),
            plannedBuilds: {},
          }
    }
    return {
        async getSettings() {
            try {
                const settings = await fs.readFile(
                  path.join(getPath('userData'), 'settings.json'),
                  'utf-8',
                );
                const res = JSON.parse(settings);
                const defaultWc3Path = path.join(getPath('documents'), 'Warcraft III');
                if (!res.wc3path) {
                    res.wc3path = defaultWc3Path;
                }
                if (!res.plannedBuilds || typeof res.plannedBuilds !== 'object'){
                  res.plannedBuilds = {};
                }
                
                return res
            } catch (e) {
                console.log(e);
                return getDefaultSettings()
            }
        },
        async writeSettings(settingsObj: any) {
            try {
                await fs.writeFile(
                  path.join(getPath('userData'), 'settings.json'),
                  JSON.stringify(settingsObj),
                );
                return 0
              } catch (e) {
                console.log(e)
                // HAAAIIIYAAAAA, its really broken somewhere if we couldnt write a file.
                return 1
              }
        }
    }
}

export type SettingsService = ReturnType<typeof createSettingsService>