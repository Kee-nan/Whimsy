module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup/loadTestEnv.js'],
  globalSetup: '<rootDir>/tests/setup/globalSetup.js',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.js',
  testTimeout: 15000,
};