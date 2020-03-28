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

export const getStudentIdFromSlug = (
  students: IStudentSummary[],
  studentSlug: string
): string => {
  const studentWithSlug = students.filter(
    ({ student_slug }) => student_slug === studentSlug
  );

  if (studentWithSlug.length === 0)
    throw new Error(`invalid student slug of ${studentSlug}`);

  return studentWithSlug[0].student_id;
};

export const getVideoIdFromUrl = (url: string) => {
  const urlParts = url.split("/");

  return urlParts[urlParts.length - 1];
};
