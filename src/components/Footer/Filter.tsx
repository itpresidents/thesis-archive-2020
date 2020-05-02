import React from "react";
import { FooterLeft, ScrollableFooterRight } from "./util";
import { Nav } from "react-bootstrap";
import { TopicDict } from "types";
import { CloseBlack } from "images/Svg";
import { Link, NavLink, Switch, Route } from "react-router-dom";
import he from "he";

const TagFilters = ({ tags }: { tags: TopicDict }) => {
  return (
    <ScrollableFooterRight>
      {Object.entries(tags).map(([slug, name]) => (
        <Nav.Item key={slug}>
          <NavLink
            replace
            to={`/filter/category/${slug}`}
            onDragStart={(e) => {
              e.preventDefault();
            }}
          >
            {he.decode(name)}
          </NavLink>
        </Nav.Item>
      ))}
    </ScrollableFooterRight>
  );
};

const AdvisorFilters = ({ advisors }: { advisors: TopicDict }) => {
  return (
    <ScrollableFooterRight>
      {Object.entries(advisors).map(([slug, name]) => (
        <Nav.Item key={slug}>
          <NavLink replace to={`/filter/advisor/${slug}`}>
            {name}
          </NavLink>
        </Nav.Item>
      ))}
    </ScrollableFooterRight>
  );
};

interface FilterMainProps {
  tags?: TopicDict;
  advisors?: TopicDict;
}

const FilterLeft = () => {
  return (
    <FooterLeft>
      <Nav.Item>
        <Link to="/" replace>
          <CloseBlack />
        </Link>{" "}
      </Nav.Item>
      <Nav.Item className="filter">
        <Link to={"/filter"} replace>
          Filter By:&nbsp;
        </Link>
      </Nav.Item>
      <Nav.Item>
        <NavLink to={`/filter/category`} replace>
          Category
        </NavLink>
      </Nav.Item>
      <Nav.Item>&nbsp;|&nbsp;</Nav.Item>
      <Nav.Item>
        <NavLink to={`/filter/advisor`} replace>
          Advisor
        </NavLink>
      </Nav.Item>
    </FooterLeft>
  );
};

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

export default FilterMain;
