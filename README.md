## Evo helper

Load characters for Twilight's Eve in WC3. You can download the latest version in releases.

Set your wc3 path and battle tag, then hit 'Refresh' button to load your classes.

Current hotkey: ``A`` This will be configurable in the future.

## Starting Development
If you want to contribute and not sure what to do (or have an idea of a change/feature) feel free to DM, or open an issue.

**nut.js removed public access for prebuilds, so you will have to manually build and link it locally**

Start the app in the `dev` environment:
Node version: 18.20.3
```bash
yarn install --frozen-lockfile
```
```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Credits

This whole app is built upon [Electron React Boilerplate](https://electron-react-boilerplate.js.org/)
