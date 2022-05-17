# electron-vampire-survivors

Check out [the template](https://github.com/electron-vite/electron-vite-vue).

It looks pretty cool, my virst time using vite.   The build uses
`electron-builder`.  The dev build script:

```
  "scripts": {
    "dev": "node scripts/watch.mjs",
```

This creates watchers and bundles `packages/main` and `packages/preload`, and also
creates a server for `packages/renderer`.

I like how this build setup works, I think it would work well for
chrome extensions too.   I had trouble with other build tools creating
something that would create both the pages for popups and other pages
and the background script, but this seems to create multiple scripts really well.

To Run, just `yarn` and then `yarn dev`.  To build do `yarn build`.

## Directory

A `dist` folder will be generated everytime when `dev` or `build` command is executed. File structure of `dist` is identical to the `packages` directory to avoid any potential path calculation errors.

```tree
├── dist                      Will be generated following the structure of "packages" directory
|   ├── main
|   ├── preload
|   └── renderer
|
├── scripts
|   ├── build.mjs             Build script -> npm run build
|   └── watch.mjs             Develop script -> npm run dev
|
├── packages
|   ├── main                  Main-process source code
|   |   └── vite.config.ts
|   ├── preload               Preload-script source code
|   |   └── vite.config.ts
|   └── renderer              Renderer-process source code
|       └── vite.config.ts
```
