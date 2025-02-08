import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: true }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Journals Test Report',
        outputPath: './test-report-journals-service.html',
        includeFailureMsg: true,
        theme: 'lightTheme',
      },
    ],
  ],
};

export default config;
