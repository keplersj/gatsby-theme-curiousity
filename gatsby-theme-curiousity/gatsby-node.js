const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const crypto = require("crypto");
const { createFilePath } = require("gatsby-source-filesystem");
const { urlResolve } = require("gatsby-core-utils");

const withDefaults = require("./utils/default-options");

// Ensure that content directories exist at site-level
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();
  const { contentPath, assetPath } = withDefaults(themeOptions);

  const dirs = [
    path.join(program.directory, contentPath),
    path.join(program.directory, assetPath)
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
  });
};

const remarkResolverPassthrough = fieldName => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType("MarkdownRemark");
  const remarkNode = context.nodeModel.getNodeById({
    id: source.parent
  });
  if (type.getFields()[fieldName].extensions.needsResolve) {
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(remarkNode, args, context, {
      fieldName
    });
    return result;
  } else {
    return remarkNode[fieldName];
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  createTypes(`interface PortfolioItem @nodeInterface {
      id: ID!
      title: String!
      html: String!
      slug: String!
      tags: [String]!
      keywords: [String]!
      excerpt: String!
      fileRelativePath: String!
      rawFrontmatter: String!
      rawMarkdownBody: String!
  }`);

  createTypes(
    schema.buildObjectType({
      name: "RemarkPortfolioItem",
      fields: {
        id: { type: "ID!" },
        title: {
          type: "String!"
        },
        slug: {
          type: "String!"
        },
        tags: { type: "[String]!" },
        keywords: { type: "[String]!" },
        excerpt: {
          type: "String!",
          args: {
            pruneLength: {
              type: "Int",
              defaultValue: 140
            }
          },
          resolve: remarkResolverPassthrough("excerpt")
        },
        html: {
          type: "String!",
          resolve: remarkResolverPassthrough("html")
        },
        fileRelativePath: {
          type: "String!",
          resolve: remarkResolverPassthrough("fileRelativePath")
        },
        rawFrontmatter: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawFrontmatter")
        },
        rawMarkdownBody: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawMarkdownBody")
        },
        frontmatter: {
          type: "MarkdownRemarkFrontmatter",
          resolve: remarkResolverPassthrough("frontmatter")
        }
      },
      interfaces: ["Node", "PortfolioItem"]
    })
  );
};

// Create fields for piece slugs and source
// This will change with schema customization with work
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
        basePath: contentPath
      });

      slug = urlResolve(basePath, filePath);
    }
    const fieldData = {
      title: node.frontmatter.title,
      tags: node.frontmatter.tags || [],
      slug,
      keywords: node.frontmatter.keywords || []
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
        description: "Remark implementation of the PortfolioItem interface"
      }
    });
    createParentChildLink({
      parent: node,
      child: getNode(remarkPortfolioPieceId)
    });
  }
};

// These templates are simply data-fetching wrappers that import components
const PieceTemplate = require.resolve("./src/templates/piece-query.ts");
const PortfolioTemplate = require.resolve("./src/templates/portfolio-query.ts");

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
  pieces.forEach(({ node: piece }, index) => {
    const { slug } = piece;
    createPage({
      path: slug,
      component: PieceTemplate,
      context: {
        id: piece.id
      }
    });
  });

  // // Create the Portfolio page
  createPage({
    path: basePath,
    component: PortfolioTemplate,
    context: {}
  });
};
