module.exports = {
  collectCoverage: true,
  projects: [
    {
      displayName: "test",
      preset: "jest-preset-gatsby/typescript",
      collectCoverage: true,
      snapshotSerializers: [
        "@emotion/jest/serializer",
        "jest-serializer-react-helmet-async",
        "jest-serializer-json-ld-script",
      ],
      coveragePathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/src/__mockData__/",
      ],
      moduleNameMapper: {
        "modern-normalize": "jest-transform-stub",
        "starstuff-style": "jest-transform-stub",
      },
    },
    {
      displayName: "lint:prettier",
      preset: "jest-runner-prettier",
      testPathIgnorePatterns: ["/coverage/", "/node_modules/", "/reports/"],
    },
    {
      displayName: "lint:stylelint",
      preset: "jest-runner-stylelint",
      testPathIgnorePatterns: ["/coverage/", "/node_modules/", "/reports/"],
    },
    {
      displayName: "lint:eslint",
      runner: "eslint",
      testMatch: [
        "<rootDir>/**/*.js",
        "<rootDir>/**/*.ts",
        "<rootDir>/**/*.tsx",
      ],
      testPathIgnorePatterns: ["/coverage/", "/node_modules/", "/reports/"],
    },
  ],
};
