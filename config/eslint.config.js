module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			modules: true,
		},
	},
	rules: {
		"@typescript-eslint/indent": ["error", "tab"],
	},
}
