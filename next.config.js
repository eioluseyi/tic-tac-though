// next.config.js
const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  /* config options here */
  webpack(config) {
    config.resolve.modules.push(__dirname);
    return config;
  },
});
