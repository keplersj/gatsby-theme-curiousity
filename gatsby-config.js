module.exports = options => ({
  plugins: [
    "gatsby-plugin-mdx",
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
  ]
});
