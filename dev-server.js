'use strict';

/*
  Browser-Sync server for serving static content
*/

// require('dotenv').config();
const bs = require('browser-sync').create();

bs.init({
  server: {
    baseDir: 'public',
    index: 'index.html',
    directory: false,
    // serveStaticOptions: {
    //   extensions: ['html'],
    // },
  },
  port: 8080,
  open: false,
  reloadDelay: 500,
  files: ['./public'],
  // proxy: `http://127.0.0.1:${process.env.PORT}`,
  // serveStatic: [{
  //   directory: true,
  //   route: '/',
  //   dir: './public',
  // }],
});
