import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IFilteredStudent, TopicDict, ISearch } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import Footer from "./Footer/index";
import { useRouteMatch } from "react-router-dom";
import * as queries from "util/queries";
import { buildSearch } from "util/search";

const generateTitle = (tag: string | null, advisor: string | null): string => {
  const opener = "ITP Thesis Archive 2020";
  if (tag) {
    return `${opener} | Projects with Category ${tag}`;
  } else if (advisor) {
    return `${opener} | Projects under Advisor ${advisor}`;
  }

  return opener;
};

interface IHomeProps {
  students: IStudentSummary[] | undefined;
}
const updateFilteredStudents = (
  students: IStudentSummary[],
  filter: (student: IStudentSummary) => boolean
): IFilteredStudent[] => {
  return students.map((student) => ({
    show: filter(student),
    student,
  }));
};

interface FilterOptions {
  tags?: TopicDict;
  advisors?: TopicDict;
}

const noFilter = (student: IStudentSummary) => true;

const Explore = ({ students }: IHomeProps) => {
  const [filteredStudents, setFilteredStudents] = useState<
    IFilteredStudent[] | null
  >(null);
  const [searchText, setSearchText] = useState<string>("");

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");
  const advisorMatch = useRouteMatch<{ advisor: string }>(
    "/filter/advisor/:advisor"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisor = advisorMatch && advisorMatch.params.advisor;

  useEffect(() => {
    const metaDescription = document.querySelector("meta[name='description']");

    if (metaDescription)
      metaDescription.setAttribute("description", "ITP Thesis Archive");

    const metaOgImageElement = document.querySelector(
      "meta[property='og:image']"
    );

    if (metaOgImageElement) metaOgImageElement.setAttribute("content", "");
  });

  useEffect(() => {
    document.title = generateTitle(tag, advisor);
  }, [tag, advisor]);

  const [{ search }, setSearch] = useState<{ search?: ISearch }>({});

  useEffect(() => {
    if (students && !search) {
      setSearch({ search: buildSearch(students) });
    }
  }, [students, search]);

  useEffect(() => {
    if (!students) return;

    if (searchText && searchText !== "") {
      if (search) {
        setFilteredStudents(search(searchText));
      }
    } else if (tag) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesTag(tag))
      );
    } else if (advisor) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesAvisor(advisor))
      );
    } else {
      setFilteredStudents(updateFilteredStudents(students, noFilter));
    }
  }, [students, tag, advisor, searchText, search]);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  useEffect(() => {
    if (students) {
      setFilterOptions(queries.getTagsAndAdvisors(students));
    }
  }, [students]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards filteredStudents={filteredStudents} />
      </div>
      <Footer
        {...filterOptions}
        searchText={searchText}
        searchTextChanged={setSearchText}
        filteredStudents={filteredStudents}
      />
    </Container>
  );
};

export default Explore;
