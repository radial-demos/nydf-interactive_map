# Interactive Map for NYDF Forest Declaration Website

## Description

Client reqested a single interactive map to display regional data corresponding to several published static figures.

## Approach

## Tooling

### Linter

[Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

Install on Linux/OSX using:

```bash
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

## TODOs

- [x] Set up basic Bootstrap 3 project in 'public' directory.
- [x] Copy data from source-data Excel workbook into a TSV file ('countries.csv').
- [x] Write a script ('convert-tsv-to-json.js') to pull only the relevant data from 'countries.csv' and save it into a JSON file ('data.json'). Webpack can then include the data in the client JS bundle.
- [ ] Set up Webpack/Babel to write bundled JS file into public directory. Include BrowserSync server.
