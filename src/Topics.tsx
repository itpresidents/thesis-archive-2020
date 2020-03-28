import React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { StringDict } from "./types";

interface ITopicsProps extends RouteComponentProps {
  topics: StringDict;
  topicSlug?: string;
}

const Topics = ({ topics }: ITopicsProps) => {
  return (
    <ul>
      {Object.entries(topics).map(([topicSlug, topicName]) => (
        <li>
          <Link to={`/topics/${topicSlug}`}>{topicName}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Topics;
