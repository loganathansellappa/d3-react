/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "babel-jest", // Babel only used in Jest. Vite uses esbuild internally
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "babel-jest",
    "^d3$": "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "dist",
    "@types",
    "src/utils/test.ts",
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,js,tsx,jsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "cobertura", "text-summary", "clover", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/", "dist", "/coverage/"],
  preset: "ts-jest/presets/js-with-ts",
};
