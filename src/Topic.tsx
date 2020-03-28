import React from "react";
import Students from "./Students";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, StringDict } from "./types";

interface ITopicProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: StringDict;
  topicSlug?: string;
}

const Topic = ({ students, topicSlug, topics }: ITopicProps) => {
  if (!students || !topicSlug) {
    return <div>Loading...</div>;
  }

  const studentsWithTopic = students.filter(({ topics }) =>
    topics.some(({ slug }) => slug === topicSlug)
  );

  const topicName = topics[topicSlug];

  return (
    <div>
      <h2>Projects with Topic {topicName}:</h2>
      <Students students={studentsWithTopic} />
    </div>
  );
};

export default Topic;
