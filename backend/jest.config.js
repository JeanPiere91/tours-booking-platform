module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'cobertura'],
  verbose: true,
};
