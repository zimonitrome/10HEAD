const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
  target: "web",
  output: {
    filename: '[name].js',
    sourceMapFilename: "[file].map",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|wav)$/i,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: [path.resolve(__dirname, "node_modules/excalibur")],
        enforce: "pre",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            }
          }
        ]
      }

    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      title: "Excalibur Webpack Sample",
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets',
      fileWhitelist: [/\.woff/, /\.woff2/, /\.ttf/],
      as: 'font',
    })
  ],
};
