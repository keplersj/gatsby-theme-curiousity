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

const mdxResolverPassthrough = fieldName => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType("Mdx");
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent
  });
  const resolver = type.getFields()[fieldName].resolve;
  const result = await resolver(mdxNode, args, context, {
    fieldName
  });
  return result;
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  createTypes(`interface PortfolioItem @nodeInterface {
      id: ID!
      title: String!
      body: String!
      slug: String!
      tags: [String]!
      keywords: [String]!
      excerpt: String!
  }`);

  createTypes(
    schema.buildObjectType({
      name: "MdxPortfolioItem",
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
          resolve: mdxResolverPassthrough("excerpt")
        },
        body: {
          type: "String!",
          resolve: mdxResolverPassthrough("body")
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

  // Make sure it's an MDX node
  if (node.internal.type !== "Mdx") {
    return;
  }

  // Create source field (according to contentPath)
  const fileNode = getNode(node.parent);
  const source = fileNode.sourceInstanceName;

  if (node.internal.type === "Mdx" && source === contentPath) {
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

    const mdxPortfolioPieceId = createNodeId(`${node.id} >>> MdxPortfolioItem`);
    await createNode({
      ...fieldData,
      // Required fields.
      id: mdxPortfolioPieceId,
      parent: node.id,
      children: [],
      internal: {
        type: "MdxPortfolioItem",
        contentDigest: crypto
          .createHash("md5")
          .update(JSON.stringify(fieldData))
          .digest("hex"),
        content: JSON.stringify(fieldData),
        description: "Mdx implementation of the PortfolioItem interface"
      }
    });
    createParentChildLink({
      parent: node,
      child: getNode(mdxPortfolioPieceId)
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
