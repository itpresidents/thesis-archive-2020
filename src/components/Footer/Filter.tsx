import React from "react";
import { FooterLeft, ScrollableFooterRight } from "./util";
import { Nav } from "react-bootstrap";
import { TopicDict } from "types";
import { CloseBlack } from "components/Svg";
import { Link, NavLink, Switch, Route } from "react-router-dom";

const tagFiltersWidth = 3000;

const TagFilters = ({ tags }: { tags: TopicDict }) => {
  return (
    <ScrollableFooterRight scrollableWidth={tagFiltersWidth}>
      {Object.entries(tags).map(([slug, name]) => (
        <Nav.Item key={slug}>
          <NavLink replace to={`/filter/category/${slug}`}>
            {name}
          </NavLink>
        </Nav.Item>
      ))}
    </ScrollableFooterRight>
  );
};

const advisorFiltersWidth = 500;

const AdvisorFilters = ({ advisors }: { advisors: TopicDict }) => {
  return (
    <ScrollableFooterRight scrollableWidth={advisorFiltersWidth}>
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
        Filter By:
      </Nav.Item>
      <Nav.Item>
        <NavLink to={`/filter/category`} replace>
          Category
        </NavLink>
      </Nav.Item>
      <Nav.Item>|</Nav.Item>
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
