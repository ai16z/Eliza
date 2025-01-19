module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
      '^@injective/(.*)$': '<rootDir>/injective-sdk-client-ts/src/$1'
  },
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setup.ts']
};
