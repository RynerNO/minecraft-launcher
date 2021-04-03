// webpack config
const path = require('path');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();
module.exports = (env = {}) => ({
	mode: process.env.MODE || 'development',
	context: path.resolve(__dirname, 'src'),
	entry: {
		app: './renderer/app.ts',
	},
	output: {
		path: path.resolve(__dirname, 'dist/renderer'),
		filename: '[name].[fullhash:6].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: { babelrc: true },
					},
					{
						loader: 'ts-loader',
						options: { appendTsSuffixTo: [/\.vue$/] },
					},
				],
			},
			{
				test: /\.pug$/,
				oneOf: [
					{
						resourceQuery: /^\?vue/,
						use: ['pug-plain-loader'],
					},
				],
			},
			{
				test: /\.sass$/i,
				use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 1 } }, { loader: 'postcss-loader' }],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(eot|woff|woff2|ttf|jpg|png|svg)([\?]?.*)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'assets/[hash].[ext]',
					},
				},
			},
		],
	},

	resolve: {
		extensions: ['.ts', '.js', '.vue', '.json'],
		alias: {
			vue: '@vue/runtime-dom',
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: './renderer/public/index.html',
		}),
		new WebpackBar(),
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
		}),
	],
	devServer: {
		port: 8080,
		historyApiFallback: true,
		static: [path.join(__dirname, 'dist/renderer')],
	},
});
