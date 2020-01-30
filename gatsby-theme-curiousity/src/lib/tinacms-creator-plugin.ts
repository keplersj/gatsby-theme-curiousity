import { RemarkCreatorPlugin } from "gatsby-tinacms-remark";
import slugify from "slugify";

export const CreatePiecePlugin = new RemarkCreatorPlugin({
  label: "New Portfolio Piece",
  filename: (form): string => {
    return `content/portfolio/${slugify(form.title, { lower: true })}.md`;
  },
  fields: [{ name: "title", label: "Title", component: "text" }],
  frontmatter: (form): object => ({
    title: form.title
  }),
  body: (): string =>
    `This is a new portfolio piece. Please write some content.`
});
