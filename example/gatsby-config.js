const path = require("path");
const REPO_ABSOLUTE_PATH = path.join(process.cwd(), "..");

module.exports = {
  siteMetadata: {
    title: "Example Site",
    siteUrl: "https://example.dev",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-tinacms",
      options: {
        plugins: [
          {
            resolve: "gatsby-tinacms-git",
            options: {
              pathToRepo: REPO_ABSOLUTE_PATH,
              pathToContent: "example",
            },
          },
        ],
      },
    },
    "gatsby-theme-curiousity",
  ],
};
