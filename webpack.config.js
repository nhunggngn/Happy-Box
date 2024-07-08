const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

module.exports = {
  entry: './src/index.js', // File entry chính của bạn
  output: {
    path: path.resolve(__dirname, 'dist'), // Thư mục đầu ra
    filename: 'bundle.js', // Tên file bundle
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_PINATA_API_KEY': JSON.stringify(process.env.REACT_APP_PINATA_API_KEY),
      'process.env.REACT_APP_PINATA_SECRET_API_KEY': JSON.stringify(process.env.REACT_APP_PINATA_SECRET_API_KEY),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', // File output HTML
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
};
