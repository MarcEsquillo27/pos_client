const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const dotenvSafe = require('dotenv');

const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
dotenvSafe.config({
  path: envPath,
  example: path.resolve(__dirname, '.env.example')
});

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/sit-hposis/' : '/',
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
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});