import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
const __dirname = path.resolve();

const common = {
  entry: path.resolve(__dirname, 'src/script.js'),
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [{ from: '../public' }],
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      minify: true,
    }),
    new MiniCSSExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(glb|gltf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/gltf/[name].[ext]',
            },
          },
        ],
      },
      // {
      //   test: /\.glb$/,
      //   loader: 'gltf-loader',
      // },
      // {
      //   test: /\.(glsl|vs|fs|vert|frag)$/,
      //   exclude: /node_modules/,
      //   use: ['raw-loader', 'glslify-loader'],
      // },
    ],
  },
  // resolve: {
  //   extensions: ['.tsx', '.ts', '.js'],
  // },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, '../src/'),
  //   },
  //   extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  // },
};

export default common;
