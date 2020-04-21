import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, Link, useRouteMatch } from "react-router-dom";
import BigHeader from "./BigHeader";
import MessageHub from "./MessageHub";
import cx from "classnames";

const Header = ({ hasStartedExploring }: { hasStartedExploring: boolean }) => {
  const rootMatch = useRouteMatch(["/"]);
  const subExploreMatch = useRouteMatch(["/filter*", "/search*"]);

  const isAtRoot = rootMatch && rootMatch.isExact;

  const isOnExploringPage = isAtRoot || subExploreMatch !== null;

  const exploreActive = isOnExploringPage && hasStartedExploring;

  return (
    <div className="fixed-top">
      <BigHeader
        collapse={hasStartedExploring}
        isAtHomePage={isOnExploringPage}
      />
      <Navbar expand="md" bg="white">
        <Link to="/" className="navbar-brand">
          ITP Thesis Archive 2020
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end ml-md-auto" as="ul">
            <Nav.Item>
              <Link
                to="/"
                className={cx("nav-link", { active: exploreActive })}
              >
                Explore
              </Link>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/videos" className="nav-link">
                Watch
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MessageHub />
    </div>
  );
};

export default Header;
