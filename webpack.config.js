const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
  	main: "./main.ts",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "./[name].js"
  },
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader"
			}
		]
	},
	devServer: {
		contentBase: "./public/"
	}
}
