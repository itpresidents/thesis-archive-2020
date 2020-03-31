import React from "react";
import StudentCards from "./components/StudentCards";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "./types";

interface ITopicProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: TopicDict;
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
      <StudentCards students={studentsWithTopic} />
    </div>
  );
};

export default Topic;
