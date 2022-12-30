import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const dev = merge(common, {
  mode: 'development',
  devServer: {
    host: 'localhost',
    open: true,
    port: 8080,
    hot: true,
    compress: true,
  },
});

export default dev;
