import { FileWithHash } from "./BundleService";
import { ParsedBundle } from "./ParserService";

export interface BundleModification {
  start: number, // where value starts in the file
  end: number, // where value ends in the file plus one
  value: string
}

export const updateBundle = (contents: string, parsed: ParsedBundle, modifications: BundleModification[]): string => {
  const mods = modifications.sort((a, b) => b.start - a.start);
  const parts: string[] = [];
  let pos = 0;
  mods.forEach(mod => {
    parts.push(contents.substring(pos, mod.start));
    parts.push(mod.value);
    pos = mod.end;
  });
  parts.push(contents.substring(pos));
  return parts.join('');
}
