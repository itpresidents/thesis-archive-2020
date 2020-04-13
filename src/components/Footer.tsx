import React, { useState, useEffect, useRef } from "react";

import "scss/footer.scss";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, Link, Route, Switch } from "react-router-dom";
import { IStudentSummary, TopicDict } from "types";
import * as queries from "util/queries";
import { Filter, Search, CloseBlack, Random } from "./Svg";
import { useDrag } from "react-use-gesture";
import { animated } from "react-spring";
import ContainerDimensions from "react-container-dimensions";

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
        <Link to="/" replace>
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

// todo: automatically determine

const HorizontalDraggable = ({
  children,
  maxWidth,
}: {
  children: React.ReactNode;
  maxWidth: number;
}) => {
  const [x, setX] = useState<number>(0);

  const bind = useDrag(
    ({ offset: [x] }) => {
      setX(x);
    },
    {
      bounds: {
        left: -maxWidth,
        bottom: 0,
        top: 0,
        right: 0,
      },
      axis: "x",
    }
  );

  return (
    <animated.div {...bind()} style={{ x }} className="inner">
      {children}
    </animated.div>
  );
};

const tagFiltersWidth = 3000;

const TagFilters = ({ tags }: { tags: TopicDict }) => {
  return (
    <div className="right navbar-nav">
      <HorizontalDraggable maxWidth={tagFiltersWidth}>
        {Object.entries(tags).map(([slug, name]) => (
          <Nav.Item key={slug}>
            <NavLink to={`/filter/category/${slug}`}>{name}</NavLink>
          </Nav.Item>
        ))}
      </HorizontalDraggable>
    </div>
  );
};

const advisorFiltersWidth = 500;

const AdvisorFilters = ({ advisors }: { advisors: TopicDict }) => {
  return (
    <div className="right navbar-nav">
      <HorizontalDraggable maxWidth={advisorFiltersWidth}>
        {Object.entries(advisors).map(([slug, name]) => (
          <Nav.Item key={slug}>
            <NavLink to={`/filter/advisor/${slug}`}>{name}</NavLink>
          </Nav.Item>
        ))}
      </HorizontalDraggable>
    </div>
  );
};

interface FilterMainProps {
  tags?: TopicDict;
  advisors?: TopicDict;
}

const FilterMain = ({ tags, advisors }: FilterMainProps) => {
  return (
    <>
      <FilterLeft />
      <Switch>
        <Route path="/filter/category">
          {tags && <TagFilters tags={tags} />}
        </Route>
        <Route path="/filter/advisor">
          {advisors && <AdvisorFilters advisors={advisors} />}
        </Route>
      </Switch>
    </>
  );
};

interface FooterProps extends OptionallyHasStudents {}

interface FilterOptions {
  tags?: TopicDict;
  advisors?: TopicDict;
}

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
      </Switch>
    </Navbar>
  );
};

export default Footer;
