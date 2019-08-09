module.exports = {
  preset: 'ts-jest',
  transform: {
  	'^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    "src/**/*.{js,ts}"
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
      outputDirectory: "./reporters/jest/"
    }],
  ],
  coverageReporters:[
    "text-lcov",
    "lcov",
    "json",
    "text",
    "clover",
  ],
};
