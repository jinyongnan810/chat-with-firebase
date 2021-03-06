const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const rootPath = path.resolve(__dirname, ".");

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map",
  entry: path.resolve(rootPath, "electron", "main.ts"),
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(rootPath, "build"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: "electron/assets", to: "assets" }] }),
  ],
};
