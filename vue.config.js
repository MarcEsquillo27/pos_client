const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const dotenvSafe = require('dotenv');

// Load environment variables based on the NODE_ENV
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
dotenvSafe.config({
  path: envPath,
  example: path.resolve(__dirname, '.env.example')
});

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  // Conditionally configure the public path and other settings
  publicPath: process.env.NODE_ENV === 'production' ? '/your-app/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  devServer: {
    proxy: process.env.VUE_APP_API_URL,
  },
});
