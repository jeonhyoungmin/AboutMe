const merge = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    open: true,
    host: "localhost",
    compress: true,
    hot: true,
    port: 5000,
    // historyApiFallback: true, // react에서 사용?
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i, // i = 대소문자 구분x
        use: ["style-loader", "css-loader", "sass-loader"],
        // 역순으로 적용 됨
        // 우선 css style loader만 설치
      },
    ],
  },
});
