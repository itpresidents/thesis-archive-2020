// {"name":"Performance","slug":"performance"},{"name":"Society","slug":"society"}]
import { IStudentSummary, TopicDict } from "types";

const compare = (a: string, b: string) => {
  if (a > b) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
};

export const sortByFirstName = (
  students: IStudentSummary[] | undefined
): IStudentSummary[] | undefined => {
  if (!students) return;

  const studentsSorted = students.slice();

  studentsSorted.sort(
    ({ student_name: studentAName }, { student_name: studentBName }) =>
      compare(studentAName, studentBName)
  );

  return studentsSorted;
};

const toLowerSnakeCase = (name: string) => {
  return name.toLowerCase().replace(/ /g, "_");
};

export const getTagsAndAdvisors = (
  students: IStudentSummary[]
): {
  tags: TopicDict;
  advisors: TopicDict;
} => {
  const allTags: TopicDict = {};
  const allAdvisors: TopicDict = {};

  for (let { tags, advisor_name } of students) {
    for (let tag of tags) {
      const { slug: tagSlug, name: tagName } = tag;
      if (!allTags[tagSlug]) {
        allTags[tagSlug] = tagName;
      }
    }
    const advisorSlug = toLowerSnakeCase(advisor_name);
    if (!allAdvisors[advisorSlug]) {
      allAdvisors[advisorSlug] = advisor_name;
    }
  }

  return {
    tags: allTags,
    advisors: allAdvisors,
  };
};

export const matchesTag = (tagSlug: string) => ({ tags }: IStudentSummary) =>
  tags.map(({ slug }) => slug).includes(tagSlug);
export const matchesAvisor = (advisorSlug: string) => ({
  advisor_name,
}: IStudentSummary) => toLowerSnakeCase(advisor_name) === advisorSlug;

export const filterByTag = (
  students: IStudentSummary[],
  tagSlug: string
): boolean[] => {
  return students.map(matchesTag(tagSlug));
};

export const filterByAdvisorName = (
  students: IStudentSummary[],
  advisorSlug: string
): IStudentSummary[] => {
  return students.filter(
    ({ advisor_name }) => toLowerSnakeCase(advisor_name) === advisorSlug
  );
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
