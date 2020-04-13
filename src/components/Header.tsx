import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, Link, LinkProps } from "react-router-dom";
import HeaderBG from "./HeaderBG";
import cx from "classnames";
import MessageHub from "./MessageHub";

const NavIgLink = <TState extends {}>(props: LinkProps<TState>) => {
  return <NavLink to={props.to}>{props.children}</NavLink>;
};

const Header = () => (
  <>
    <div className="fixed-top">
      <HeaderBG />
      <Navbar expand="md" bg="white">
        <Link to="/" className="navbar-brand">
          ITP Thesis Archive 2020
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end ml-md-auto" as="ul">
            <Nav.Item>
              <NavLink to="/" exact className="nav-link">
                Explore
              </NavLink>
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
  </>
);

export default Header;
