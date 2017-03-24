var webpack = require('webpack');
var path = require('path');
// var CompressionPlugin = require('compression-webpack-plugin');

var ENTRY = path.resolve(__dirname + '/front-end/js/main.js');
var OUPUT = path.resolve(__dirname + '/public/javascripts');

var config = {
  entry: ENTRY,
  output: {
    path: OUPUT,
    filename: 'bundle.js'
  },
  module: {
  	loaders: [
  		{
  			test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
  		}
  	]
  },
  devtool: 'eval-source-map'
//   plugins: [
// 	// new webpack.DefinePlugin({
// 	//   'process.env': {
// 	//       'NODE_ENV': `"production"`
// 	//   }
// 	// }),
//   	// new webpack.optimize.AggressiveMergingPlugin(),
//   	// new webpack.optimize.UglifyJsPlugin({
// 	//   compress: { warnings: false },
// 	//   comments: false,
// 	//   minimize: false
// 	// }),
//     // new CompressionPlugin()
//   ]
};

module.exports = config;