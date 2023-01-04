import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
const __dirname = path.resolve();

const common = {
  entry: {
    main: './src/script.js',
    first: './src/first/first.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    // new CopyWebpackPlugin({
    //    { from: path.resolve(__dirname, 'public') }
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: ['main'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'first.html',
      template: path.resolve(__dirname, 'src/first/first.html'),
      chunks: ['first'],
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
        test: /\.css$/i,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg|hdr)$/i,
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};

export default common;
