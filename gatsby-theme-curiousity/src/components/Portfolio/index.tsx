import React from "react";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { PortfolioListItem as Project } from "../PortfolioListItem";

const Projects = styled.div`
  margin-left: 2em;
  margin-right: 2em;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

interface Props {
  data: {
    allPortfolioItem: {
      edges: {
        node: {
          id: string;
          excerpt: string;
          slug: string;
          title: string;
        };
      }[];
    };
  };
}

const ProjectsPage = ({ data }: Props): React.ReactElement<Props> => (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://www.schema.org",
          "@type": "CollectionPage",
          name: "Projects | Kepler Sticka-Jones",
          url: "/projects",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://keplersj.com/",
                  name: "Kepler Sticka-Jones"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": "https://keplersj.com/projects/",
                  name: "Projects"
                }
              }
            ]
          },
          about: {
            "@type": "ItemList",
            name: "Projects | Kepler Sticka-Jones",
            url: "/projects",
            numberOfItems: data.allPortfolioItem.edges.length,
            itemListElement: data.allPortfolioItem.edges.map(
              ({ node }): object => ({
                "@type": "Thing",
                name: node.title,
                description: node.excerpt,
                url: node.slug
              })
            )
          }
        })}
      </script>
    </Helmet>

    <BaseLayout title="Projects">
      <Projects>
        <h1>Projects</h1>
        <ListContainer>
          {data.allPortfolioItem.edges.map(
            ({ node }): React.ReactElement => (
              <Project
                key={node.id}
                location={node.slug}
                title={node.title}
                description={node.excerpt}
              />
            )
          )}
        </ListContainer>
      </Projects>
    </BaseLayout>
  </>
);

export default ProjectsPage;
