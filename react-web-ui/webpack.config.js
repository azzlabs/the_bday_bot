const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');

module.exports = {
  entry: "./src/app.js",
  output: { path: path.resolve(__dirname, "dist") },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { "runtime": "automatic" }]],
          }
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.mp4$/,
        use: 'file-loader?name=videos/[name].[ext]',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: './src/index.html' // the template for our HTML file
    }),
    new Dotenv()
    /* new HtmlWebpackInjectPreload({
      files: [
        {
          match: /.*\.woff2$/,
          attributes: { as: 'font', type: 'font/woff2', crossorigin: true },
        },
        {
          match: /.*\.png$/,
          attributes: { as: 'image' },
        },
        {
          match: /.*\.jpg$/,
          attributes: { as: 'image' },
        },
        {
          match: /.*\.mp4$/,
          attributes: { as: 'video' },
        },
        {
          match: /vendors\.[a-z-0-9]*.css$/,
          attributes: { as: 'style' },
        },
      ]
    }) */
  ],
  devServer: {
    static: './dist/',
    open: true,
    port: 3001,
    allowedHosts: "all",
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  }
};