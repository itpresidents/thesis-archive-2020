// {"name":"Performance","slug":"performance"},{"name":"Society","slug":"society"}]
import { IStudentSummary, StringDict, IStudentDetails, ITag } from "types";

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

export const toLowerSnakeCase = (name: string) => {
  return name.toLowerCase().replace(/ /g, "_");
};

export const getTagsAndAdvisors = (
  students: IStudentSummary[]
): {
  tags: StringDict;
  advisors: StringDict;
} => {
  const allTags: StringDict = {};
  const allAdvisors: StringDict = {};

  for (let { topics: tags, advisor_name, advisor_id } of students) {
    for (let tag of tags) {
      const { slug: tagSlug, name: tagName } = tag;
      if (!allTags[tagSlug]) {
        allTags[tagSlug] = tagName;
      }
    }
    if (!allAdvisors[advisor_id]) {
      allAdvisors[advisor_id] = advisor_name || "";
    }
  }

  return {
    tags: allTags,
    advisors: allAdvisors,
  };
};

export const matchesTag = (tagSlug: string) => ({
  topics: tags,
}: IStudentSummary) => tags.map(({ slug }) => slug).includes(tagSlug);

export const matchesAdvisor = (advisorIdToMatch: string) => ({
  advisor_id,
}: IStudentSummary) => advisor_id === advisorIdToMatch;

export const filterByTag = (
  students: IStudentSummary[],
  tagSlug: string
): boolean[] => {
  return students.map(matchesTag(tagSlug));
};

export const getStudentIdFromSlug = (
  studentSlugs: { slug: string; id: string }[],
  studentSlug: string
): string | null => {
  const studentWithSlug = studentSlugs.filter(
    ({ slug }) => slug === studentSlug
  );

  if (studentWithSlug.length === 0) return null;

  return studentWithSlug[0].id;
};
export const getStudentSlugFromId = (
  studentSlugs: { slug: string; id: string }[],
  studentId: string
): string | null => {
  const studentWithSlug = studentSlugs.filter(({ id }) => id === studentId);

  if (studentWithSlug.length === 0) return null;

  return studentWithSlug[0].slug;
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

const hasAnyTags = (tags: ITag[], tagsToMatch: string[]): boolean => {
  for (let tag of tags) {
    if (tagsToMatch.includes(tag.slug)) return true;
  }

  return false;
};

export const randomSimilarStudents = (
  student: IStudentDetails,
  students: IStudentSummary[],
  numToGet: number
): IStudentSummary[] => {
  const shuffledStudents = shuffle(students);

  const result: IStudentSummary[] = [];

  const studentTagsToMatch = student.topics.map(({ slug }) => slug);

  for (let randomStudent of shuffledStudents) {
    if (hasAnyTags(randomStudent.topics, studentTagsToMatch)) {
      result.push(randomStudent);

      if (result.length >= numToGet) {
        break;
      }
    }
  }

  return result;
};
