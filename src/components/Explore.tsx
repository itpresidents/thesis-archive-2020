import React, { useState, useEffect, useReducer } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IStudentFilter } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";
import Footer from "./Footer";
import { Switch, Route } from "react-router-dom";
import * as queries from "util/queries";

interface IHomeProps {
  students: IStudentSummary[] | undefined;
}

type menu = "filter" | "search" | null;
type filterMenu = "advisor" | "category" | null;

interface ExploreState {
  openMenu: menu;
  openFilterMenu: filterMenu;
  selectedTag: string | null;
}

type action =
  | {
      type: "openMenu";
      menu: menu;
    }
  | {
      type: "openFilterMenu";
      filterMenu: filterMenu;
    }
  | {
      type: "closeFilterMenu";
    }
  | {
      type: "setTag";
      tag: string;
    };

function reducer(state: ExploreState, action: action): ExploreState {
  switch (action.type) {
    case "openMenu":
      return {
        ...state,
        openMenu: action.menu,
        openFilterMenu: action.menu === "filter" ? "category" : null,
      };
    case "openFilterMenu":
      return {
        ...state,
        openFilterMenu: action.filterMenu,
      };
    case "closeFilterMenu":
      return {
        ...state,
        openMenu: null,
      };
    case "setTag":
      return {
        ...state,
        selectedTag: action.tag,
      };
  }
}

const initialState: ExploreState = {};

const Explore = ({ students }: IHomeProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [filteredStudents, setFilteredStudents] = useState<
    IStudentSummary[] | undefined
  >();

  useEffect(() => {
    if (!students) return;

    console.log("tag", tag);
    if (!tag) {
      setFilteredStudents(students);
    } else {
      const studentsWithTag = queries.filterByTag(students, tag);
      setFilteredStudents(studentsWithTag);
    }
  }, [students, tag]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards
              students={filteredStudents}
              width={width}
              height={height}
            />
          )}
        </ContainerDimensions>
      </div>
      {tag}
      <Footer students={students} setTag={setTag} />
    </Container>
  );
};

export default Explore;
