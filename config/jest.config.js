module.exports = {
	rootDir: "../",
	preset: 'ts-jest',
	transform: {
		'^.+\\.js$': [
			'babel-jest',
			{
				configFile: "./config/babel.config.js",
			},
		],
	},
	globals: {
		'ts-jest': {
			tsConfig: './config/tsconfig.json',
		},
	},
	collectCoverage: true,
	coverageDirectory: './coverage/',
	collectCoverageFrom: [
		"<rootDir>/src/**/*.{js,ts}",
	],
	coveragePathIgnorePatterns: [
		".*_old.js",
	],
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
	},
	reporters: [
		"default",
		["jest-junit", {
			outputDirectory: "./reporters/jest/",
		}],
	],
	coverageReporters: [
		"text-lcov",
		"lcov",
		"json",
		"text",
		"clover",
	],
};
