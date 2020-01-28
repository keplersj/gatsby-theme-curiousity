import { RemarkCreatorPlugin } from "gatsby-tinacms-remark";
import slugify from "slugify";

export const CreatePiecePlugin = new RemarkCreatorPlugin({
  label: "New Portfolio Piece",
  filename: form => {
    return `content/portfolio/${slugify(form.title, { lower: true })}.md`;
  },
  fields: [{ name: "title", label: "Title", component: "text" }],
  frontmatter: form => ({
    title: form.title
  }),
  body: () => `This is a new portfolio piece. Please write some content.`
});
