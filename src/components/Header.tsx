import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, LinkProps } from "@reach/router";
import HeaderBG from "./HeaderBG";
import cx from "classnames";

const NavLink = <TState extends {}>(props: LinkProps<TState>) => {
  return (
    <Link
      to={props.to}
      getProps={({ isCurrent }) => ({
        class: cx("nav-link", { active: isCurrent }),
      })}
    >
      {props.children}
    </Link>
  );
};

const Header = () => (
  <>
    <HeaderBG />
    <Navbar
      expand="md"
      sticky="top"
      className="border-top border-bottom"
      bg="white"
    >
      <Link to="/" className="navbar-brand">
        Thesis Archive 2020
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="justify-content-end ml-md-auto" as="ul">
          <Nav.Item>
            <NavLink to="/">Explore</NavLink>{" "}
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/videos">Watch</NavLink>{" "}
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/about">About</NavLink>{" "}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default Header;
