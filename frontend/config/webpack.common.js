const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // 내장 plugin에 접근하는 데 사용
const path = require("path");
const { Template } = require("webpack");

module.exports = {
  mode: "development", // 나누어서 사용할 예정이기 때문에 제외
  entry: { index: "./src/index.ts", test: "./src/test.ts" },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
