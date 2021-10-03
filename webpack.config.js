'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

/**
 * react-boilerplate scripts
 */
const NodeUtils = require('./internal/common/node-service');
const buildInfo = require('./scripts/buildInfo');
const appConfig = require('./config/config');

buildInfo();

const APP_DIR = path.join(__dirname, 'src');
const NODE_MODULES = path.join(__dirname, 'node_modules');

const isDevelopment = NodeUtils.isDevelopment();

/**
 * Get webpack plugins
 * @returns {*[]}
 */
function getPlugins() {
  return [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css',
    }),

    /**
     * Inject bundles and CSS directly into the HTML template
     */
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body',
    }),

    /**
     * Pass NODE_ENV and APP_CONFIG to the application so that
     * "ConfigService" and "NodeService" can be used within TS/TSX files.
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_CONFIG: JSON.stringify(appConfig),
      },
    }),
  ];
}

/**
 * Set up code splitting and chunking
 */
function getCodeSplittingConfig() {
  return {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 8,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  };
}

/**
 * Get Webpack file parsing rules
 * @returns {*[]}
 */
function getParserRules() {
  return [
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {},
        },
        'css-loader',
        'postcss-loader',
      ],
      include: APP_DIR,
      exclude: NODE_MODULES,
    },
    {
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      include: APP_DIR,
      exclude: NODE_MODULES,
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      include: APP_DIR,
      exclude: NODE_MODULES,
    },
    {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
      use: 'url-loader?limit=10000&name=[name]-[hash].[ext]',
      include: APP_DIR,
      exclude: NODE_MODULES,
    },
    {
      test: /\.ico$/,
      use: 'file-loader?name=[name].[ext]',
      exclude: NODE_MODULES,
    },
    {
      test: /\.json$/,
      use: 'json-loader',
      include: APP_DIR,
      exclude: NODE_MODULES,
    },
  ];
}

const webpackConfig = {
  /**
   * Configure the output directory and bundle name
   */
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[hash].js',
  },
  resolve: {
    /**
     * Allow webpack to automatically resolve import extensions
     */
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', 'scss'],
    /**
     * Define aliases to be used within import statements.
     * Be sure to update "tsconfig.json" if you add/update/delete aliases.
     */
    alias: {
      '~app': path.resolve(APP_DIR),
      '~assets': path.resolve(APP_DIR, 'assets/'),
      '~components': path.resolve(APP_DIR, 'components/'),
      '~reducers': path.resolve(APP_DIR, 'reducers/'),
      '~services': path.resolve(APP_DIR, 'services/'),
    },
  },
  /**
   * Set up code splitting and chunking
   */
  optimization: getCodeSplittingConfig(),
  /**
   * Set up webpack plugins
   */
  plugins: getPlugins(),
  /**
   * Set up module parsing rules
   */
  module: {
    rules: getParserRules(),
  },
};

/**
 * Add additional configurations based on NODE_ENV
 */
if (!NodeUtils.isDevelopment()) {
  webpackConfig.entry = './src/Bootstrap';
  webpackConfig.mode = 'production';
} else {
  webpackConfig.mode = 'development';
  webpackConfig.entry = [
    `webpack-dev-server/client?http://localhost:${appConfig.example.port}`,
    'webpack/hot/only-dev-server',
    './src/Bootstrap',
  ];
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new ReactRefreshWebpackPlugin({overlay: false}));

  webpackConfig.devServer = {
    open: true,
    port: appConfig.example.port,
    stats: 'errors-only',
    inline: true,
    injectClient: false,
    historyApiFallback: true,
  };
}

module.exports = webpackConfig;
