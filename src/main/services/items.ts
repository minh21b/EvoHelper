import { PrismaClient } from "@prisma/client";
import { TItem } from "../../types";




export function createItemsService (prismaClient: PrismaClient) {
    const SOURCE_ORDER = [
        "Fishing",
        "Fragmented Soul",
        "Gemstone",
        "Blacksmith",
        "Heads merchant",
        "Agony merchant",
        "Weapons Dealer",
        "Armorsmith",
        "Icy Highland",
        "Forgotten Crypt",
        "Gold Mine",
        "Centaur mountain",
        "Bandit Lord",
        "Puzzle sanctuary",
        "Naga Ruins",
        "Forgotten Sewers",
        "Oblivion",
        "Abyssal Labyrinth",
        "Death's Realm",
        "Tristram",
        "Weapons Master",
        "Bob the Builder",
        "Magic Wizard",
        "Ancient Soul",
        "City of Illusions",
        "Angel of Clouds",
        "Dragon Fortress",
        "Angel of Nature",
        "Angel of Sun",
        "Angel of Revenge",
        "Punishment Chamber",
        "Mystery forging items",
        "Imp3Mats",
        "Hyrule Prophet",
        "Fire merchant",
        "Flame merchant",
        "Mystery craft",
        "Cursed Heaven",
        "Alter Ego",
        "Agahnim",
        "Chiral Valley",
        "Champion Of Chaos",
        "Betrayed Chaos",
        "Tercessuinotlim"
    ];

    // Faster lookup
    const SOURCE_INDEX = new Map(
    SOURCE_ORDER.map((s, i) => [s, i])
    );

    const formatItem = (item: any): TItem => { // shameless 'any' plug
        // @ts-ignore
        const recipe = item.recipe?.reduce((acc, curr) => {
            return acc.concat((new Array(curr.quantity)).fill(curr.input.name))
        }, []);
        return {
            integerId: item.id,
            id: item.name,
            name: item.displayName,
            icon: item.icon,
            legacyItem: !!item.legacyItem,
            description: item.description || '',
            effects: item.effects ? item.effects.split('$') : [],
            restriction: item.restriction?.name || '', // not sure if '' is possible
            rarity: item.rarity,
            source: item.source,
            sourceShort: item.sourceShort,
            recipe,
            partOf: item.partOf.map((el: any) => el.output.name),
            godlyCraft: recipe.indexOf('Twilight') !== -1 // dirtiest hack, but it works.
        }
    }

    const include = {
        recipe: {
            include: {
                input: {
                    select: {
                        name: true
                    }
                }
            }
        },
        partOf: {
            include: {
                output: {
                    select: {
                        name: true
                    }
                }
            }
        },
        rarity: true,
        restriction: true,   
    }

    prismaClient.$extends({})

    return {
        async getUnformattedItemByName(name: string) {
            const item = await prismaClient.item.findUnique({
                include,
                where: {
                    name: name
                }
            })

            if (!item) return null;
            
            return item;
        },

        async getItemByName(name: string) {
            const item = await prismaClient.item.findUnique({
                include,
                where: {
                    name: name
                }
            })

            if (!item) return null;

            return formatItem(item);
        },
        
        async getAllItems() {
            // god, I hope this won't be called a lot.
            const itemsList = await prismaClient.item.findMany({ 
                include,
                // orderBy: [
                //     {rarity: { id: 'asc'}},
                // ] 
            });
            itemsList.sort((a, b) => {
                const aIndex = SOURCE_INDEX.get(a.source) ?? Number.MAX_SAFE_INTEGER;
                const bIndex = SOURCE_INDEX.get(b.source) ?? Number.MAX_SAFE_INTEGER;
                return aIndex - bIndex;
            });
            return itemsList.map(item => formatItem(item))
        },

        async getAllItemsDict() {
            const itemsList = await prismaClient.item.findMany({ 
                include,
                // orderBy: [
                //     { rarity: { id: 'asc'}},
                // ]
            });
            itemsList.sort((a, b) => {
                const aIndex = SOURCE_INDEX.get(a.source) ?? Number.MAX_SAFE_INTEGER;
                const bIndex = SOURCE_INDEX.get(b.source) ?? Number.MAX_SAFE_INTEGER;
                return aIndex - bIndex;
            });
        
            return itemsList.reduce((acc: any, curr) => {
                acc[curr.name] = formatItem(curr);
                return acc;
            }, {})
        }
    }
}