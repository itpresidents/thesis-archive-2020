import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IFilteredStudent } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import { useRouteMatch } from "react-router-dom";
import * as queries from "util/queries";

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

const noFilter = (student: IStudentSummary) => true;

const Explore = ({ students }: IHomeProps) => {
  const [filteredStudents, setFilteredStudents] = useState<
    IFilteredStudent[] | null
  >(null);

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");
  const advisorMatch = useRouteMatch<{ advisor: string }>(
    "/filter/advisor/:advisor"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisor = advisorMatch && advisorMatch.params.advisor;

  useEffect(() => {
    document.title = generateTitle(tag, advisor);

    const metaDescription = document.querySelector("meta[name='description']");

    if (metaDescription)
      metaDescription.setAttribute("description", "ITP Thesis Archive");

    const metaOgImageElement = document.querySelector(
      "meta[property='og:image']"
    );

    if (metaOgImageElement) metaOgImageElement.setAttribute("content", "");
  }, [tag, advisor]);

  useEffect(() => {
    if (!students) return;

    if (tag) {
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
  }, [students, tag, advisor]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards filteredStudents={filteredStudents} />
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
