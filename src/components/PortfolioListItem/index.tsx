import React from "react";
import { Link } from "gatsby";
import { Card } from "starstuff-components";
import styled from "@emotion/styled";

interface Props {
  location: string;
  title: string;
  description: string;
}

const CustomCard = styled(Card)`
  border: 1px solid;
  border-radius: 5px;
  width: 20em;
  margin: 0.5em;
  background-color: #fafafa;
  padding: 1em;

  @media (max-width: 35em) {
    flex-grow: 1;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #282c34;
  }
`;

export const PortfolioListItem = (props: Props): React.ReactElement<Props> => (
  <CustomCard
    title={props.title}
    location={props.location}
    customLinkComponent={(title, location): React.ReactElement => (
      <Link to={location}>
        <h2>{title}</h2>
      </Link>
    )}
    supporting={<div>{props.description}</div>}
  />
);
