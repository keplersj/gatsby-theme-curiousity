/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const crypto = require("crypto");
const { createFilePath } = require("gatsby-source-filesystem");
const { urlResolve } = require("gatsby-core-utils");
const withDefaults = require("./utils/default-options");
/* eslint-enable @typescript-eslint/no-var-requires */

// Ensure that content directories exist at site-level
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();
  const { contentPath, assetPath } = withDefaults(themeOptions);

  const directories = [
    path.join(program.directory, contentPath),
    path.join(program.directory, assetPath),
  ];

  directories.forEach((directory) => {
    if (!fs.existsSync(directory)) {
      mkdirp.sync(directory);
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const remarkResolverPassthrough = (fieldName) => async (
  source,
  arguments_,
  context,
  info
) => {
  const type = info.schema.getType("MarkdownRemark");
  const remarkNode = context.nodeModel.getNodeById({
    id: source.parent,
  });
  if (type.getFields()[fieldName].extensions.needsResolve) {
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(remarkNode, arguments_, context, {
      fieldName,
    });
    return result;
  } else {
    return remarkNode[fieldName];
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createTypes(`type PortfolioItemMetadata {
    type: [String]
    homepage: String
    githubRepo: String
    npmPackageName: String
    rubygemsGemName: String
    status: [String]
    role: [String]
  }`);

  createTypes(`interface PortfolioItem @nodeInterface {
      id: ID!
      title: String!
      html: String!
      slug: String!
      tags: [String]!
      keywords: [String]!
      excerpt: String!
      featuredImage: File
      fileRelativePath: String!
      rawFrontmatter: String!
      rawMarkdownBody: String!
      metadata: PortfolioItemMetadata!
  }`);

  createTypes(
    // schema.buildObjectType({
    //   name: "RemarkPortfolioItemMetadata",
    //   fields: {
    //     id: { type: "ID!" },
    //     type: { type: "[String]" },
    //     githubRepo: { type: "String" },
    //     npmPackageName: { type: "String" },
    //     rubygemsGemName: { type: "String" },
    //     status: { type: "[String]" },
    //     role: { type: "[String]" }
    //   },
    //   interfaces: ["Node", "PortfolioItemMetadata"]
    // }),

    schema.buildObjectType({
      name: "RemarkPortfolioItem",
      fields: {
        title: {
          type: "String!",
        },
        slug: {
          type: "String!",
        },
        tags: { type: "[String]!" },
        keywords: { type: "[String]!" },
        excerpt: {
          type: "String!",
          args: {
            pruneLength: {
              type: "Int",
              defaultValue: 140,
            },
          },
          resolve: remarkResolverPassthrough("excerpt"),
        },
        html: {
          type: "String!",
          resolve: remarkResolverPassthrough("html"),
        },
        featuredImage: { type: "File", extensions: { fileByRelativePath: {} } },
        fileRelativePath: {
          type: "String!",
          resolve: remarkResolverPassthrough("fileRelativePath"),
        },
        rawFrontmatter: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawFrontmatter"),
        },
        rawMarkdownBody: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawMarkdownBody"),
        },
        frontmatter: {
          type: "MarkdownRemarkFrontmatter",
          resolve: remarkResolverPassthrough("frontmatter"),
        },
        metadata: {
          type: "PortfolioItemMetadata!",
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          resolve: async (source, arguments_, context, info) => {
            const frontmatter = await remarkResolverPassthrough("frontmatter")(
              source,
              arguments_,
              context,
              info
            );
            return {
              type:
                frontmatter && frontmatter.type ? frontmatter.type : undefined,
              homepage:
                frontmatter && frontmatter.homepage
                  ? frontmatter.homepage
                  : undefined,
              githubRepo:
                frontmatter && frontmatter.github_repo
                  ? frontmatter.github_repo
                  : undefined,
              npmPackageName:
                frontmatter && frontmatter.npm_package_name
                  ? frontmatter.npm_package_name
                  : undefined,
              rubygemsGemName:
                frontmatter && frontmatter.rubygems_gem_name
                  ? frontmatter.rubygems_gem_name
                  : undefined,
              status:
                frontmatter && frontmatter.status
                  ? frontmatter.status
                  : undefined,
              role:
                frontmatter && frontmatter.role ? frontmatter.role : undefined,
            };
          },
        },
      },
      interfaces: ["Node", "PortfolioItem"],
    })
  );
};

// Create fields for piece slugs and source
// This will change with schema customization with work
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.onCreateNode = async (
  { node, actions, getNode, createNodeId },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;
  const { contentPath, basePath } = withDefaults(themeOptions);

  if (node.internal.type !== "MarkdownRemark") {
    return;
  }

  // Create source field (according to contentPath)
  const fileNode = getNode(node.parent);
  const source = fileNode.sourceInstanceName;

  if (node.internal.type === "MarkdownRemark" && source === contentPath) {
    let slug;
    if (node.frontmatter.slug) {
      if (path.isAbsolute(node.frontmatter.slug)) {
        // absolute paths take precedence
        slug = node.frontmatter.slug;
      } else {
        // otherwise a relative slug gets turned into a sub path
        slug = urlResolve(basePath, node.frontmatter.slug);
      }
    } else {
      // otherwise use the filepath function from gatsby-source-filesystem
      const filePath = createFilePath({
        node: fileNode,
        getNode,
        basePath: contentPath,
      });

      slug = urlResolve(basePath, filePath);
    }
    const fieldData = {
      title: node.frontmatter.title,
      tags: node.frontmatter.tags || [],
      slug,
      keywords: node.frontmatter.keywords || [],
      featuredImage: node.frontmatter.featured_image,
    };

    const remarkPortfolioPieceId = createNodeId(
      `${node.id} >>> RemarkPortfolioItem`
    );
    await createNode({
      ...fieldData,
      // Required fields.
      id: remarkPortfolioPieceId,
      parent: node.id,
      children: [],
      internal: {
        type: "RemarkPortfolioItem",
        contentDigest: crypto
          .createHash("md5")
          .update(JSON.stringify(fieldData))
          .digest("hex"),
        content: JSON.stringify(fieldData),
        description: "Remark implementation of the PortfolioItem interface",
      },
    });
    createParentChildLink({
      parent: node,
      child: getNode(remarkPortfolioPieceId),
    });
  }
};

// These templates are simply data-fetching wrappers that import components
const PieceTemplate = require.resolve("./src/templates/piece-query.ts");
const PortfolioTemplate = require.resolve("./src/templates/portfolio-query.ts");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;
  const { basePath } = withDefaults(themeOptions);

  const result = await graphql(`
    {
      allPortfolioItem(sort: { fields: [title] }, limit: 1000) {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  // Create Portfolio and Piece pages.
  const { allPortfolioItem } = result.data;
  const pieces = allPortfolioItem.edges;

  // Create a page for each Piece
  pieces.forEach(({ node: piece }) => {
    const { slug } = piece;
    createPage({
      path: slug,
      component: PieceTemplate,
      context: {
        id: piece.id,
      },
    });
  });

  // // Create the Portfolio page
  createPage({
    path: basePath,
    component: PortfolioTemplate,
    context: {},
  });
};
