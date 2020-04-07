import React, { useState, useEffect } from "react";

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
        <Link to={`${url}filter/category`}>Filter</Link>
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

interface FilterMainProps {
  tags?: TopicDict;
}

const TagFilters = ({ tags }: { tags: TopicDict }) => {
  const { url } = useRouteMatch();

  return (
    <Nav>
      {Object.entries(tags).map(([tagSlug, tagName]) => (
        <Nav.Item>
          <NavLink to={`${url}/${tagSlug}`} className="nav-link">
            {tagName}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

const FilterMain = ({ tags }: FilterMainProps) => {
  const { path } = useRouteMatch();

  return (
    <>
      <FilterLeft />
      <Switch>
        <Route path={`${path}category`}>
          {tags && <TagFilters tags={tags} />}
        </Route>
      </Switch>
    </>
  );
};

interface FooterProps extends OptionallyHasStudents {
  // setFilter: (fn: IStudentFilter) => void
}

const Footer = ({ students }: FooterProps) => {
  const { path } = useRouteMatch();

  const [tags, setTags] = useState<TopicDict | undefined>();

  useEffect(() => {
    if (students) {
      setTags(queries.getTags(students));
    }
  }, [students]);

  return (
    <Navbar fixed="bottom" bg="white">
      <Switch>
        <Route exact path={path}>
          <FooterMain />
        </Route>
        <Route path={`${path}filter/`}>
          <FilterMain tags={tags} />
        </Route>
      </Switch>
    </Navbar>
  );
};

export default Footer;
