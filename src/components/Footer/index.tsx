import React from "react";
import { StringDict, IStudentSummary } from "types";
import { Navbar, Nav } from "react-bootstrap";
import { Route, Switch, Link } from "react-router-dom";
import { SearchIcon, Random, Filter } from "images/Svg";
import FilterMain from "./Filter";
import SearchMain from "./Search";
import cx from "classnames";

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
      <Link to={`/random`}>
        <Random /> Random
      </Link>
    </Nav.Item>
  </Nav>
);

interface FooterProps {
  tags?: StringDict;
  advisors?: StringDict;
  searchText: string;
  searchTextChanged: (searchText: string) => void;
  filteredStudents: IStudentSummary[] | undefined;
  show: boolean;
}

const Footer = ({
  tags,
  advisors,
  searchText,
  searchTextChanged,
  filteredStudents,
  show,
}: FooterProps) => {
  return (
    <Navbar fixed="bottom" bg="white" className={cx("footer", { show })}>
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
