// import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
const __dirname = path.resolve();

const common = {
  entry: {
    main: './src/script.js',
    root: './src/root/script.js',
    routing: './src/routing/script.js',
    clock: './src/clock/script.js',
    ugauga: './src/ugauga/script.js',
    meojeonpass: './src/meojeonpass/script.js',
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
      filename: 'root.html',
      template: path.resolve(__dirname, 'src/root/index.html'),
      chunks: ['root'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'routing.html',
      template: path.resolve(__dirname, './src/routing/index.html'),
      chunks: ['routing'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'clock.html',
      template: path.resolve(__dirname, './src/clock/index.html'),
      chunks: ['clock'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'ugauga.html',
      template: path.resolve(__dirname, './src/ugauga/index.html'),
      chunks: ['ugauga'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'meojeonpass.html',
      template: path.resolve(__dirname, './src/meojeonpass/index.html'),
      chunks: ['meojeonpass'],
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
