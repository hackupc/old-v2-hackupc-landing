const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  mode: 'development',
  devServer: {
    static:{
      directory: path.resolve('dist'),
    },
    compress: true,
    client: {
      overlay: true,
      progress: true,
    },
    hot: true,
    // Uncomment the two lines below to enable hot reload on mobile
    // host: 'local-ip',
    // allowedHosts: 'all'
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          {
            loader: 'postcss-loader', // Loader for webpack to process CSS with PostCSS
            options: {
              postcssOptions: {
                plugins: [
                  require('stylelint')(),
                  require('postcss-reporter')({ clearReportedMessages: true }),
                ],
              },
            },
          },
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /node_modules.*\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /(favicon\.ico|ogimage\.png)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
      {
        test: /(hackupc-logo-black\.svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'hackupc-logo[ext]',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: true,
              minimize: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                ignoreCustomComments: [/^!/, /^\s*#/, /google(on|off)/i],
                minifyCSS: true,
                minifyJS: true,
              },
            },
          },
          'markup-inline-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.ts', '.js', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
}
