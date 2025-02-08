import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  verbose: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: true }],
    '^.+\\.jsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: true }],
  },
  transformIgnorePatterns: ['/node_modules/(?!@mui|cheerio|enzyme-to-json)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^common/(.*)$': '<rootDir>/src/common/$1',
  },
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Frontend Test Report',
        outputPath: './test-report-frontend.html',
        includeFailureMsg: true,
        theme: 'lightTheme',
      },
    ],
  ],
};

export default config;
