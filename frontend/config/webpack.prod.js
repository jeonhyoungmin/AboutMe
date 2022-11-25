// const { merge } = require("webpack-merge");
// const common = require("./webpack.common");
// const path = require("path");

// const MinicssExtractPlugin = require("mini-css-extract-plugin");
// const TerserPlugin = reuqire("terser-webpack-plugin");
// const CssminimizerPlugin = require("css-minimizer-webpack-plugin");

// module.exports = merge(common, {
//   mode: "production",
//   devtool: "cheap-module-source-map",
//   output: {
//     filename: "[name].[contenthash].js",
//     path: path.resolve(__dirname, "../dist"),
//     publicPath: "./",
//     clean: true,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(sa|sc|c)ss$/i,
//         use: [MinicssExtractPlugin.loader, "css-loader", "sass-loader"],
//       },
//     ],
//   },
//   plugins: [new MinicssExtractPlugin()],
//   optimization: {
//     usedExports: true,
//     minimize: true,
//     minimizer: [
//       new TerserPlugin({
//         terserOptions: {
//           compress: {
//             drop_console: true,
//           },
//         },
//       }),
//       new CssminimizerPlugin(),
//     ],
//     splitChunk: {
//       chunks: "all",
//     },
//   },
//   performence: {
//     hints: false,
//     maxEntrypointSize: 512000,
//     maxAssetSize: 512000,
//   },
// });
