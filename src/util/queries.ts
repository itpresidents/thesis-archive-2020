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

export const isNumber = (stringValue: string): boolean => !isNaN(+stringValue);

export function selectRandom<T>(elements: T[]): T {
  const randomIndex = Math.floor(Math.random() * elements.length);

  return elements[randomIndex];
}

export function shuffle<T>(toShuffle: T[]): T[] {
  // clone
  const arrayClone = toShuffle.slice();
  let currentIndex = arrayClone.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arrayClone[currentIndex];
    arrayClone[currentIndex] = arrayClone[randomIndex];
    arrayClone[randomIndex] = temporaryValue;
  }

  return arrayClone;
}
