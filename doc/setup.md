# Setup

I used [this github template](https://github.com/electron-vite/electron-vite-vue).  
Clicking 'Use this template' let me create a repo based on it.

## Add Pinia

Check out [pinia.md](pinia.md)

## Add VUE Devtools

First install an extension that will install it:

    yarn add -D electron-devtools-installer

Add command to install devtools in development in `packages/main/index.ts`:

```ts
import installExtension from 'electron-devtools-installer'

const installDevtools = async () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
}

// added installDevtools step
app.whenReady().then(installDevtools).then(createWindow);
```