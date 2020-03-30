import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "@reach/router";
import HeaderBG from "./HeaderBG";

const Header = () => (
  <>
    <HeaderBG />
    <div className="sticky-top bg-white border-top border-bottom">
      <Navbar>
        <Navbar.Brand>Thesis Archive 2020</Navbar.Brand>
        <Nav fill variant="tabs">
          <Nav.Item>
            <Link to="/" className="nav-link">
              Students
            </Link>{" "}
          </Nav.Item>
          <Nav.Item>
            <Link to="/videos" className="nav-link">
              Videos
            </Link>{" "}
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  </>
);

export default Header;
