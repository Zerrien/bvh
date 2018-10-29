module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    "src/**/*.{js,ts}"
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  }
};
