// eslint-disable-next-line @typescript-eslint/no-var-requires
const withDefaults = require("./utils/default-options");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (themeOptions) => {
  const options = withDefaults(themeOptions);
  const { remark = true } = themeOptions;

  return {
    siteMetadata: {
      title: "Portfolio Site",
      description: "This is a portfolio built using gatsby-theme-curiousity",
    },
    plugins: [
      {
        resolve: "gatsby-plugin-tinacms",
        options: {
          sidebar: {
            hidden: process.env.NODE_ENV === "production",
            position: "displace",
          },
          plugins: ["gatsby-tinacms-git", "gatsby-tinacms-remark"],
        },
      },
      remark && "gatsby-transformer-remark",
      {
        resolve: "gatsby-source-filesystem",
        options: {
          path: options.contentPath || "content/portfolio",
          name: options.contentPath || "content/portfolio",
        },
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          path: options.assetPath || "content/assets",
          name: options.assetPath || "content/assets",
        },
      },
      "gatsby-plugin-emotion",
      "gatsby-plugin-react-helmet-async",
      "gatsby-transformer-sharp",
      "gatsby-plugin-sharp",
      "gatsby-plugin-typescript",
    ].filter(Boolean),
  };
};
