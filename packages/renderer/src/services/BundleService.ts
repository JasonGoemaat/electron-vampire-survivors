import { createHash } from 'crypto'
import { existsSync, readFileSync } from 'fs'

export interface FileWithHash {
  filePath: string,
  contents: string,
  md5: string,
  exists: boolean
}

export const loadBundle = (filePath: string): FileWithHash => {
  if (!existsSync(filePath))
  {

    return ({
      filePath,
      contents: '',
      md5: '',
      exists: false
    });
  }

  const contents = readFileSync(filePath, { encoding: 'utf-8' });
  const md5 = createHash('md5').update(contents).digest("hex")
  return ({
    filePath,
    contents,
    md5,
    exists: true
  })
}
