import { defineStore } from 'pinia'
import { ipcRenderer } from 'electron'
import { existsSync, readFileSync, writeFileSync,  } from 'fs'
import { loadBundle, FileWithHash } from '../services/BundleService'
import { createDefaultConfig, CharacterMod } from '../models/Config'
import { parseBundle, ParsedBundle } from '../services/ParserService'
import { createHash } from 'crypto'

export enum GameStates {
  Start,
  NeedBackup,
  HashMismatch,
  Initialized,
  Error
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
    state: GameStates.Start,
    mainSettings: <MainSettings | undefined>undefined,
    haveGamePath: false,
    haveBackupFile: false,
    haveBundle: false,
    error: '',
    userData: '',
    message: 'Initializing...',
    bundle: <FileWithHash | undefined>undefined,
    backup: <FileWithHash | undefined>undefined,
    config: createDefaultConfig(),
    parsed: <ParsedBundle | undefined>undefined
  }),
  getters: {
    characters(): any[] {
      return this.parsed?.characters || [];
    }  },
  actions: {
    async initialize() {
      this.state = GameStates.Start;
      const result = await ipcRenderer.invoke('init');
      
      this.mainSettings = result;
      if (result.error) {
        this.state = GameStates.Error;
        this.error = result.error;
        return;
      }

      // check if we have a backup file, it should be created
      this.haveBackupFile = existsSync(this.mainSettings?.backupPath || '');
      this.haveBundle = existsSync(this.mainSettings?.bundlePath || '');
      if (!(this.haveBackupFile && this.haveBundle)) {
        this.state = GameStates.NeedBackup;
        return;
      }

      this.bundle = loadBundle(this.mainSettings?.bundlePath || '');
      this.backup = loadBundle(this.mainSettings?.backupPath || '');

      if (!(this.bundle.exists && this.backup.exists)) {
        this.state = GameStates.Error;
        this.error = "Unknown error - we have the backup and bundle, but something went wrong :(";
        return;
      }

      // get config, create if needed
      if (!existsSync(this.mainSettings?.configPath || '')) {
        this.config.lastSavedMd5 = this.bundle.md5;
        await this.saveConfig();
      }
      this.config = JSON.parse(readFileSync(this.mainSettings?.configPath || '', { encoding: 'utf-8' }));
      if (this.config.lastSavedMd5 !== this.backup.md5) {
        this.state = GameStates.HashMismatch;
        return;
      }

      // parse the backup bundle
      const parsed = parseBundle(this.backup.contents);
      this.parsed = parsed;
      (window as any).parsed = parsed;
      (window as any).characters = parsed.characters;

      // parse *backup* bundle
      this.state = GameStates.Initialized;
    },

    async updateBackup() {
      this.state = GameStates.Start;
      const text = this.bundle?.contents || '';
      const path = this.mainSettings?.backupPath || '';
      console.log(`Writing ${text.length} characters to ${this.mainSettings?.backupPath}`);
      writeFileSync(path, text, { encoding: 'utf-8' });
      this.config.lastSavedMd5 = this.bundle?.md5 || 'error!';
      await this.saveConfig();
      await this.initialize();
    },

    async saveConfig() {
      const json = JSON.stringify(this.config, null, 2);
      const path = this.mainSettings?.configPath || '';
      console.log('Saving config, path:', path);
      console.log(json);
      writeFileSync(path, json);
    },

    getCharacterMod(name: string): CharacterMod {
      this.config.characterMods = this.config.characterMods || {};
      return this.config.characterMods[name] || {};
    },

    setCharacterMod(name: string, mod?: CharacterMod) {
      if (mod) {
        this.config.characterMods[name] = mod;
      } else {
        delete this.config.characterMods[name];
      }
      this.saveConfig();
    },

    saveBundle(contents: string) {
      if (!this.bundle) {
        alert('error!');
        return;
      }

      const md5 = createHash('md5').update(contents).digest("hex");
      writeFileSync(this.bundle.filePath, contents, { encoding: 'utf-8' });
      this.bundle.md5 = md5;
      this.bundle.contents = contents;
      this.config.lastSavedMd5 = md5;
      this.saveConfig();
    }
  }
})
