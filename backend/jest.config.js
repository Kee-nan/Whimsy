module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup/loadTestEnv.js'],
  globalSetup: '<rootDir>/tests/setup/globalSetup.js',
  testTimeout: 15000,
};