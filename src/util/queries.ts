// {"name":"Performance","slug":"performance"},{"name":"Society","slug":"society"}]
import { IStudentSummary, TopicDict } from "../types";

export const getTopics = (students: IStudentSummary[]): TopicDict => {
  const result: TopicDict = {};

  for (let { topics } of students) {
    for (let topic of topics) {
      const { slug, name } = topic;
      if (!result[slug]) {
        result[slug] = name;
      }
    }
  }

  return result;
};
