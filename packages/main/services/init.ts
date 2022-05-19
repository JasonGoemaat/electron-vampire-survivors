import path from 'path'
import { ipcMain, app } from 'electron'
import { getGamePath } from 'steam-game-path'
import { existsSync, readFileSync, writeFileSync } from 'fs';

const APPID = 1794680; // from 'steam_appid.txt' in game folder
const BUNDLE_RELATIVE_PATH = 'resources/app/.webpack/renderer/main.bundle.js'

export default () => {
  ipcMain.handle('init', (event, ...args) => {
    const userDataPath = app.getPath('userData');
    console.log('userDataPath:', userDataPath);
    const configPath = path.join(userDataPath, 'settings.config');

    const gamePathObject = getGamePath(APPID);
    const gamePath = gamePathObject?.game?.path;
    if (!gamePath) {
      const error = `Could not find game folder for steam appid ${APPID}, do you have 'Vampire Survivors' installed?`;
      return { error };
    }

    const bundlePath = path.resolve(gamePath, BUNDLE_RELATIVE_PATH);
    const backupPath = path.resolve(userDataPath, 'main.bundle.backup');

    if (existsSync(bundlePath) && !existsSync(backupPath)) {
      const bundleContents = readFileSync(bundlePath, { encoding: 'utf-8' });
      writeFileSync(backupPath, bundleContents, { encoding: 'utf-8' });
    }

    const result = { gamePath, bundlePath, backupPath, userDataPath, configPath }
    console.log(result);
    return result;
  });
}
