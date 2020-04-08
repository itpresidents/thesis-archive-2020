import React, { useState, useEffect, useReducer } from "react";

import "scss/footer.scss";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, Link, useRouteMatch, Route, Switch } from "react-router-dom";
import { IStudentSummary, TopicDict, IStudentFilter } from "types";
import * as queries from "util/queries";

type mode = "filter" | "search" | null;

const FooterMain = () => {
  const { url } = useRouteMatch();
  return (
    <Nav className="d-flex justify-content-center w-100">
      <Nav.Item>Search</Nav.Item>
      <Nav.Item>
        <Link to={`${url}/filter`}>Filter</Link>
      </Nav.Item>
    </Nav>
  );
};

const FilterLeft = () => {
  const { url } = useRouteMatch();
  return (
    <Nav>
      <Nav.Item>Filter By:</Nav.Item>
      <Nav.Item>
        <NavLink to={`${url}/category`} className="nav-link">
          Category
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink to={`${url}/advisor`} className="nav-link">
          Advisor
        </NavLink>
      </Nav.Item>
    </Nav>
  );
};

interface OptionallyHasStudents {
  students: IStudentSummary[] | undefined;
}

const buildTagsFilter = (tagSlug: string) => (students: IStudentSummary[]) => {
  debugger;
  return queries.filterByTag(students, tagSlug);
};

const TagFilters = ({
  tags,
  setTag,
  url,
}: {
  url: string;
  tags: TopicDict;
  setTag: (tag: string | undefined) => void;
}) => {
  const {
    params: { tagSlug },
  } = useRouteMatch<{ tagSlug?: string }>();

  useEffect(() => {
    setTag(tagSlug);

    return function cleanup() {
      setTag(undefined);
    };
  }, [tagSlug, setTag]);

  return (
    <Nav>
      {Object.entries(tags).map(([tagSlug, tagName]) => (
        <Nav.Item key={tagSlug}>
          <NavLink to={`${url}/${tagSlug}`} className="nav-link">
            {tagName}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

interface FilterMainProps {
  tags?: TopicDict;
  setTag: (tag: string | undefined) => void;
}

const FilterMain = ({ tags, setTag }: FilterMainProps) => {
  const { url, path } = useRouteMatch();

  return (
    <>
      <FilterLeft />
      <Switch>
        <Route path={`${path}/category/:tagSlug?`}>
          {tags && <TagFilters tags={tags} setTag={setTag} url={url} />}
        </Route>
      </Switch>
    </>
  );
};

interface FooterProps extends OptionallyHasStudents {
  setTag: (tag: string | undefined) => void;
}

type menu = "filter" | "search";
type filterMenu = "advisor" | "category";

interface FooterState {
  openMenu?: menu;
  openFilterMenu?: filterMenu;
  selectedTag?: string;
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

function reducer(state: FooterState, action: action): FooterState {
  switch (action.type) {
    case "openMenu":
      return {
        openMenu: action.menu,
        openFilterMenu: action.menu === "filter" ? "category" : undefined,
      };
    case "openFilterMenu":
      return {
        ...state,
        openFilterMenu: action.filterMenu,
      };
    case "closeFilterMenu":
      return {};
    case "setTag":
      return {
        ...state,
        selectedTag: action.tag,
      };
  }
}

const initialState = {};

const Footer = ({ students }: FooterProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tags, setTags] = useState<TopicDict | undefined>();
  const { path } = useRouteMatch();

  const setTag = (tag: string) =>
    dispatch({
      action: "setTag",
      tag,
    });

  useEffect(() => {
    if (students) {
      setTags(queries.getTags(students));
    }
  }, [students]);

  return (
    <Navbar fixed="bottom" bg="white">
      {!state.openMenu && <FooterMain />}
      {state.openMenu && state.openFilterMenu === "category" && (
        <FilterMain tags={tags} setTag={setTag} />
      )}
    </Navbar>
  );
};

export default Footer;
