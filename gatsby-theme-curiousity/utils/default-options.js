// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = themeOptions => {
  const basePath = themeOptions.basePath || `/`;
  const contentPath = themeOptions.contentPath || `content/portfolio`;
  const assetPath = themeOptions.assetPath || `content/assets`;

  return {
    basePath,
    contentPath,
    assetPath
  };
};
