import React, { useState, useEffect, useReducer } from "react";

import "scss/footer.scss";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, Link, useRouteMatch, Route, Switch } from "react-router-dom";
import { IStudentSummary, TopicDict, IStudentFilter } from "types";
import * as queries from "util/queries";
import { Filter, Search, CloseBlack, Random } from "./Svg";

type mode = "filter" | "search" | null;

const FooterMain = () => {
  // const { path } = useRouteMatch();
  return (
    <Nav className="d-flex justify-content-center w-100 main">
      <Nav.Item>
        <Link to={`/search`} replace>
          <Search /> Search
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={`/filter/category`} replace>
          <Filter /> Filter
        </Link>
      </Nav.Item>
      <Nav.Item className="randon">
        <Link to={`/random`} replace>
          <Random /> Random
        </Link>
      </Nav.Item>
    </Nav>
  );
};

const FilterLeft = () => {
  return (
    <Nav className="left">
      <Nav.Item>
        <Link to="/">
          <CloseBlack />
        </Link>{" "}
        Filter By:
      </Nav.Item>
      <Nav.Item>
        <NavLink to={`/filter/category`} replace>
          Category
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink to={`/filter/advisor`} replace>
          Advisor
        </NavLink>
      </Nav.Item>
    </Nav>
  );
};

interface OptionallyHasStudents {
  students: IStudentSummary[] | undefined;
}

const TagFilters = ({ tags }: { tags: TopicDict }) => {
  return (
    <Nav className="right">
      {Object.entries(tags).map(([tagSlug, tagName]) => (
        <Nav.Item key={tagSlug}>
          <NavLink to={`/filter/category/${tagSlug}`}>{tagName}</NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

interface FilterMainProps {
  tags?: TopicDict;
}

const FilterMain = ({ tags }: FilterMainProps) => {
  return (
    <>
      <FilterLeft />
      <Switch>
        <Route path="/filter/category">
          {tags && <TagFilters tags={tags} />}
        </Route>
      </Switch>
    </>
  );
};

interface FooterProps extends OptionallyHasStudents {}

const Footer = ({ students }: FooterProps) => {
  const [tags, setTags] = useState<TopicDict | undefined>();

  useEffect(() => {
    if (students) {
      setTags(queries.getTags(students));
    }
  }, [students]);

  return (
    <Navbar fixed="bottom" bg="white" className="footer">
      <Switch>
        <Route exact path="/">
          <FooterMain />
        </Route>
        <Route path="/filter">
          <FilterMain tags={tags} />
        </Route>
      </Switch>
    </Navbar>
  );
};

export default Footer;
