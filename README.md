#### Covers

- typescript
- react-redux
- react-scripts(instead of webpack5)
- firebase auth
- firebase realtime database

#### Problems

- tsconfig.json: `"noEmit": true` is needed by react-scripts but cause problem in electron
- electron assets not being moved to build folder when built

#### build

- react: `npm run build`
- electron: comment out `"noEmit": true` and `npm run dev:electron`
