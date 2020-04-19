import React from "react";
import { TopicDict, IStudentSummary } from "types";
import { Navbar, Nav } from "react-bootstrap";
import { Route, Switch, Link } from "react-router-dom";
import { SearchIcon, Random, Filter } from "components/Svg";
import FilterMain from "./Filter";
import SearchMain from "./Search";

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

interface FooterProps {
  tags?: TopicDict;
  advisors?: TopicDict;
  searchText: string;
  searchTextChanged: (searchText: string) => void;
  filteredStudents: IStudentSummary[];
}

const Footer = ({
  tags,
  advisors,
  searchText,
  searchTextChanged,
  filteredStudents,
}: FooterProps) => {
  return (
    <Navbar fixed="bottom" bg="white" className="footer">
      <Switch>
        <Route exact path="/">
          <FooterMain />
        </Route>
        <Route path="/filter">
          <FilterMain tags={tags} advisors={advisors} />
        </Route>
        <Route path="/search">
          <SearchMain
            text={searchText}
            textChanged={searchTextChanged}
            searchResults={filteredStudents}
          />
        </Route>
      </Switch>
    </Navbar>
  );
};

export default Footer;
