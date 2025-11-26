export default {
  transform: {},
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/tests/k6/'],
  verbose: true,
  clearMocks: true,
  setupFiles: ['./tests/setupEnv.js'],
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
};
