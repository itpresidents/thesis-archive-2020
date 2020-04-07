import React from "react";
import { Link } from "react-router-dom";
import { TopicDict } from "types";

interface ITopicsProps {
  topics: TopicDict;
  topicSlug?: string;
}

const Topics = ({ topics }: ITopicsProps) => {
  return (
    <ul>
      {Object.entries(topics).map(([topicSlug, topicName]) => (
        <li key={topicSlug}>
          <Link to={`/topics/${topicSlug}`}>{topicName}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Topics;
