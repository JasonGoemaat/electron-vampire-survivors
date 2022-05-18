const rx = /'charName':'/g

export interface BundleObject {
  start: number,
  end: number
}

export interface BundleCharacter {
  characterStart: number,
  characterEnd: number
  characterStats: Map<string, BundleObject>
}

const parseFile = (contents: string) => {
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

const parseCharacters = (contents: string) => {
  const characters = [];
  const objects = parseFile(contents);
  for (let i = 0; i < objects.length; i++) {
    const { start, end } = objects[i];
    const charName = indexOfProperty(contents, start, end, 'charName')
    if (charName[0] < 0) continue; // not found
    const nextCharName = indexOfProperty(contents, charName[1], end, 'charName');
    if (nextCharName[0] >= 0) continue; // multiples
    console.log('Found character, charName is:', charName[2]);

    const level = indexOfProperty(contents, start, end, 'level');
    const cooldown = indexOfProperty(contents, start, end, 'cooldown');
    const surname = indexOfProperty(contents, start, end, 'surname');
    const textureName = indexOfProperty(contents, start, end, 'textureName');
    const spriteName = indexOfProperty(contents, start, end, 'spriteName');
    const description = indexOfProperty(contents, start, end, 'description');
    const isBought = indexOfProperty(contents, start, end, 'isBought');
    const price = indexOfProperty(contents, start, end, 'price');
    const maxHp = indexOfProperty(contents, start, end, 'maxHp');
    const armor = indexOfProperty(contents, start, end, 'armor');
    const regen = indexOfProperty(contents, start, end, 'regen');
    const moveSpeed = indexOfProperty(contents, start, end, 'moveSpeed');
    const power = indexOfProperty(contents, start, end, 'power');
    const cooldown2 = indexOfProperty(contents, cooldown[1], end, 'cooldown');
    const area = indexOfProperty(contents, start, end, 'area');
    const speed = indexOfProperty(contents, start, end, 'speed');
    const duration = indexOfProperty(contents, start, end, 'duration');
    const amount = indexOfProperty(contents, start, end, 'amount');
    const luck = indexOfProperty(contents, start, end, 'luck');
    const growth = indexOfProperty(contents, start, end, 'growth');
    const greed = indexOfProperty(contents, start, end, 'greed');
    const curse = indexOfProperty(contents, start, end, 'curse');
    const magnet = indexOfProperty(contents, start, end, 'magnet');
    const revivals = indexOfProperty(contents, start, end, 'revivals');
    const rerolls = indexOfProperty(contents, start, end, 'rerolls');
    const skips = indexOfProperty(contents, start, end, 'skips');
    const banish = indexOfProperty(contents, start, end, 'banish');

    characters.push({
      charName, 
      surname,
      description,
      maxHp,
      armor,
      regen,
      moveSpeed,
      power,
      cooldown,
      cooldown2,
      area,
      speed,
      duration,
      amount,
      luck,
      growth,
      greed,
      curse,
      magnet,
      revivals,
      rerolls,
      skips,
      banish,
      textureName,
      spriteName,
    })
  }

  return characters;
}

export default {
  parseFile,
  parseCharacters
}
