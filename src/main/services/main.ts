import { PrismaClient } from '@prisma/client'
import { createItemsService } from './items'
import { createSettingsService } from './settings'
import { createDamageService } from './damage'

const prismaClient = new PrismaClient()

const settingsServiceMock = {
    getSettings: async () => {
        return {
            wc3path: "C:\\Users\\Shiro\\Documents\\Warcraft III"
        }
    }
}

async function main() {
    const itemService = createItemsService(prismaClient)
    console.log(JSON.stringify(await itemService.getUnformattedItemByName('Starlight Crystal'), null,2));
   // const damageService = createDamageService(settingsServiceMock);
   // console.log(JSON.stringify(await damageService.getLatestRunPerPlayer(), null, 4));
   //console.log(JSON.stringify(await damageService.getLatestRunPerDamageType(), null, 4));
}

main()
    .then(() => console.log('Process exited: 0'))
    .catch((e) => {
        console.log(e)
        console.log('Process exited: 1')
    })