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
    proxy: {
      // Proxy all requests starting with /api to your API URL
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        secure: false, // If your API is HTTP, set this to false
        // pathRewrite: { '^/api': '' } // Uncomment this line if your API does not have a /api prefix
      },
    },
  },
});
