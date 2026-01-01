import fs from 'fs/promises';

const PREFIX = 'call Preload( "';
const TITLE_AFFIX = 'Drop Details';
const LINE_AFFIX = ' - " )';

const extractDropDetails = (str: string) => {
  return str
    .split('\n')
    .filter((el) => el.indexOf(PREFIX) != -1)
    .map((str: string) => str.slice(PREFIX.length + 1, str.indexOf(LINE_AFFIX)).split(' - '));
}

export const parseLastRun = async (path: string) => {
  const classFile = await fs.readFile(path + "\\CustomMapData\\Twilight's Eve Evo\\LastReplayInfo.txt", 'utf-8');


  const titleStartIndex = classFile.indexOf(PREFIX);
  const titleEndIndex = classFile.indexOf(TITLE_AFFIX);

  const title = classFile.slice(titleStartIndex + PREFIX.length, titleEndIndex - 1);
  const data = extractDropDetails(classFile.slice(titleEndIndex));

  return `> **${title}**\n` +
    data
      .map((el, index) => `${index + 1}. ${el.shift()} - ${el.shift()}: ${el.join(', ')}`)
      .join('\n');
}

