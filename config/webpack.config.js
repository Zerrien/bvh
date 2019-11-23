const path = require('path');

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: {
		main: "./docs/main.ts",
		worker: "./docs/worker.ts",
	},
	output: {
		path: path.resolve(__dirname, "../docs/public"),
		filename: "./[name].js",
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"@src": path.resolve(__dirname, "../src"),
			"BVH": path.resolve(__dirname, "../src"),
		}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				options: {
					configFile: "config/tsconfig.json", // Note: Cannot use ./ because of... some issue.
				},
			},
		],
	},
	devServer: {
		contentBase: "./docs/public",
		stats: 'errors-only',
	},
};
