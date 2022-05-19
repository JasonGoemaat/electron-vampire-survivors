const rx = /'charName':'/g

export interface ParsedBundle {
  objects: BundleObject[],
  characters: BundleCharacter[],
  mobs: BundleCharacter[]
}

export interface BundleObject {
  start: number,
  end: number
}

export interface BundleCharacter {
  name: string,
  start: number,
  end: number,
  stats: any,
  positions: any
}

export const parseObjects = (contents: string) => {
  const stack: number[] = [];
  const containedObjects: number[] = [];
  const objects: any[] = [];

  for (let i = 0; i < contents.length; i++) {
    const ch = contents[i];
    if (ch === '{') {
      stack.push(i);
      containedObjects.push(0);
    } else if (ch === '}') {
      const object = {
        start: stack[stack.length - 1],
        end: i,
        length: i - stack[stack.length - 1] + 1
      }
      containedObjects[containedObjects.length - 1]++;
      objects.push(object);
      stack.pop();
    }
  }

  return objects;
}

const indexOfProperty = (contents: string, start: number, end: number, propertyName: string): [number, number, string] => {
  // TODO: This doesn't work for string properties that have commas in them, i.e. description for 'Lama'
  const first = contents.indexOf(`'${propertyName}':`, start);
  if (first < 0 || first >= end) return [-1, -1, '']; // not found

  const next = contents.indexOf(`'${propertyName}`, start + propertyName.length + 3);
  if (next >= end) return [-1, -1, '']; // multiple
  
  // we have the position as first, so we move past the colon and take until the next comma
  const valueStart = first + propertyName.length + 3;
  const valueEnd = contents.indexOf(',', valueStart);
  if (valueEnd < 0) {
    return [-1, -1, ''];
  }

  return [valueStart, valueEnd, contents.substring(valueStart, valueEnd)];
}

export interface CharacterProperty {
  startValue: number,
  endValue: number,
  value: string
}

export const CHARACTER_PROPERTY_NAMES = [
  'charName',
  'surname',
  'description',
  'textureName',
  'spriteName',
  'isBought',
  'level',
  'cooldown',
  'maxHp',
  'armor',
  'regen',
  'moveSpeed',
  'power',
  'area',
  'speed',
  'duration',
  'amount',
  'luck',
  'growth',
  'greed',
  'curse',
  'magnet',
  'revivals',
  'rerolls',
  'skips',
  'banish',
]

export const parseCharacters = (contents: string, objects: BundleObject[]): BundleCharacter[] => {
  const characters: BundleCharacter[] = [];
  for (let i = 0; i < objects.length; i++) {
    const { start, end } = objects[i];
    const charName = indexOfProperty(contents, start, end, 'charName')
    if (charName[0] < 0) continue; // not found
    const nextCharName = indexOfProperty(contents, charName[1], end, 'charName');
    if (nextCharName[0] >= 0) continue; // multiples

    const stats: any = {};
    const positions: any = {};
    CHARACTER_PROPERTY_NAMES.forEach(propertyName => {
      const [startValue, endValue, value] = indexOfProperty(contents, start, end, propertyName);
      stats[propertyName] = value;
      positions[propertyName] = { startValue, endValue };
    });

    const parsableName = ('"' + charName[2].substring(1, charName[2].length - 1) + '"').replaceAll(/\\\'/g, "'");
    characters.push({
      name: JSON.parse(parsableName),
      start,
      end,
      stats,
      positions
    })
  }

  return characters;
}

export const parseBundle = (contents: string): ParsedBundle => {
  const objects = parseObjects(contents);
  let characters = parseCharacters(contents, objects);
  const mobs = characters.filter(x => x.stats?.description.length <= 2);
  characters = characters.filter(x => x.stats?.description.length > 2);
  return {
    objects,
    characters,
    mobs
  }
}
