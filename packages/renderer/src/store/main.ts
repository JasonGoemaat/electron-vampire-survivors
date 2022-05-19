import { defineStore } from 'pinia'
import { ipcRenderer } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { loadBundle, FileWithHash } from '../services/BundleService'
import { Config, createDefaultConfig } from '../models/Config'
import { parseBundle, ParsedBundle } from '../services/ParserService'

export enum GameStates {
  start,
  needBackup,
  initialized,
  error
}

export interface MainSettings {
  gamePath?: string,
  bundlePath?: string,
  backupPath?: string,
  configPath?: string,
  userDataPath?: string,
  error?: string
}

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    state: GameStates.start,
    mainSettings: <MainSettings | undefined>undefined,
    haveGamePath: false,
    haveBackupFile: false,
    haveBundle: false,
    error: '',
    bundlePath: '',
    backupPath: '',
    userData: '',
    message: 'Initializing...',
    bundle: <FileWithHash | undefined>undefined,
    backup: <FileWithHash | undefined>undefined,
    config: createDefaultConfig(),
    parsed: <ParsedBundle | undefined>undefined
  }),
  actions: {
    async initialize() {
      const result = await ipcRenderer.invoke('init');
      
      this.mainSettings = result;
      if (result.error) {
        this.state = GameStates.error;
        this.error = result.error;
        return;
      }

      // check if we have a backup file, it should be created
      this.haveBackupFile = existsSync(this.mainSettings?.backupPath || '');
      this.haveBundle = existsSync(this.mainSettings?.bundlePath || '');
      if (!(this.haveBackupFile && this.haveBundle)) {
        this.state = GameStates.needBackup;
        return;
      }

      this.bundle = loadBundle(this.mainSettings?.bundlePath || '');
      this.backup = loadBundle(this.mainSettings?.backupPath || '');

      if (!(this.bundle.exists && this.backup.exists)) {
        this.state = GameStates.error;
        this.error = "Unknown error - we have the backup and bundle, but something went wrong :(";
        return;
      }

      // get config, create if needed
      if (!existsSync(this.mainSettings?.configPath || '')) {
        this.config.lastSavedMd5 = this.bundle.md5;
        writeFileSync(this.mainSettings?.configPath || '', JSON.stringify(this.config), { encoding: 'utf-8' });
      }
      this.config = JSON.parse(readFileSync(this.mainSettings?.configPath || '', { encoding: 'utf-8' }));

      // parse the backup bundle
      const parsed = parseBundle(this.backup.contents);
      this.parsed = parsed;
      (window as any).parsed = parsed;
      (window as any).characters = parsed.characters;

      // parse *backup* bundle
      this.state = GameStates.initialized;
    }
  }
})
