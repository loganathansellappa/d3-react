export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // process `*.tsx` files with `ts-jest`
    },
    rootDir: 'src',
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
        '^@app/(.*)$': '<rootDir>/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', 'dist', '@types'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,js,tsx,jsx}'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'cobertura', 'text-summary', 'clover', 'lcov'],
    coveragePathIgnorePatterns: ['/node_modules/', 'dist'],
};