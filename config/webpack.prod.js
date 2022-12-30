import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const prod = merge(common, {
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
});

export default prod;
