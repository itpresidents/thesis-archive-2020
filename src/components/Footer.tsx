import React from "react";

import "scss/footer.scss";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IStudentFilter } from "types";

type mode = "filter" | "search" | null;

interface FooterMainProps {}

export const FooterMain = (props: FooterMainProps) => (
  <Nav className="d-flex justify-content-center w-100">
    <Nav.Item>Search</Nav.Item>
    <Nav.Item>
      <Link to="/filter">Filter</Link>
    </Nav.Item>
  </Nav>
);
interface FooterProps {
  // setFilterStudents: (filterStudents: IStudentFilter) => void;
}

const Footer = (props: FooterProps) => {
  return (
    <Navbar fixed="bottom" bg="white">
      <FooterMain />
    </Navbar>
  );
};

export default Footer;
