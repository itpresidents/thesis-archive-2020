import React, { useState, useEffect } from "react";
import { TopicDict, IStudentSummary } from "types";
import * as queries from "util/queries";
import { Navbar, Nav } from "react-bootstrap";
import { Route, Switch, Link } from "react-router-dom";
import { SearchIcon, Random, Filter } from "components/Svg";
import FilterMain from "./Filter";
import SearchMain from "./Search";

interface OptionallyHasStudents {
  students: IStudentSummary[] | undefined;
}

interface FooterProps extends OptionallyHasStudents {}

interface FilterOptions {
  tags?: TopicDict;
  advisors?: TopicDict;
}

const FooterMain = () => (
  <Nav className="d-flex justify-content-center w-100 main">
    <Nav.Item>
      <Link to={`/search`} replace>
        <SearchIcon /> Search
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

const Footer = ({ students }: FooterProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  useEffect(() => {
    if (students) {
      setFilterOptions(queries.getTagsAndAdvisors(students));
    }
  }, [students]);

  return (
    <Navbar fixed="bottom" bg="white" className="footer">
      <Switch>
        <Route exact path="/">
          <FooterMain />
        </Route>
        <Route path="/filter">
          <FilterMain
            tags={filterOptions.tags}
            advisors={filterOptions.advisors}
          />
        </Route>
        <Route path="/search">
          <SearchMain />
        </Route>
      </Switch>
    </Navbar>
  );
};

export default Footer;
