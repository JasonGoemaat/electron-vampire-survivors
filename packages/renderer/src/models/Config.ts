export interface Config {
  lastSavedMd5: string
}

export const createDefaultConfig = (): Config => ({
  lastSavedMd5: ''
})
