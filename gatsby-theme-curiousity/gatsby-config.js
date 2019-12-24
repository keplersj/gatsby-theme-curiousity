const withDefaults = require("./utils/default-options");

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);
  const { mdx = true } = themeOptions;

  return {
    siteMetadata: {
      title: "Portfolio Site",
      description: "This is a portfolio built using gatsby-theme-curiousity"
    },
    plugins: [
      mdx && {
        resolve: "gatsby-plugin-mdx",
        options: {
          extensions: [".mdx", ".md"]
        }
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          path: options.contentPath || "content/portfolio",
          name: options.contentPath || "content/portfolio"
        }
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          path: options.assetPath || "content/assets",
          name: options.assetPath || "content/assets"
        }
      },
      "gatsby-plugin-emotion",
      "gatsby-plugin-react-helmet",
      "gatsby-transformer-sharp",
      "gatsby-plugin-sharp",
      "gatsby-plugin-typescript"
    ].filter(Boolean)
  };
};
