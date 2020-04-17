import { IStudentSummary, ISearch } from "types";
import * as JsSearch from "js-search";

interface ISearchableStudent extends IStudentSummary {
  index: number;
}

export const buildSearch = (students: IStudentSummary[]): ISearch => {
  const searchableStudent = students.map((student, index) => ({
    ...student,
    index,
  }));

  const search = new JsSearch.Search("student_name");
  search.addIndex("student_name");
  search.addIndex("title");

  search.addDocuments(searchableStudent);

  return (searchString: string) => {
    const searchResults = search.search(searchString) as ISearchableStudent[];

    const filteredResults = students.map((student) => ({
      student,
      show: false,
    }));

    searchResults.forEach((result) => {
      filteredResults[result.index].show = true;
    });

    return filteredResults;
  };
};
