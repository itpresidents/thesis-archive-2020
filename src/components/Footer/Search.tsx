import React from "react";
import { IFilteredStudent } from "types";
import { FooterLeft, ScrollableFooterRight } from "./util";
import { Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CloseBlack } from "components/Svg";

interface SearchProps {
  text: string;
  textChanged: (search: string) => void;
  searchResults: IFilteredStudent[];
}

const SearchMain = ({ text, textChanged, searchResults }: SearchProps) => {
  return (
    <>
      <FooterLeft>
        <Nav.Item>
          <Link to="/" replace onClick={() => textChanged("")}>
            <CloseBlack />
          </Link>{" "}
        </Nav.Item>
        <Nav.Item>
          <Form inline>
            <input
              type="text"
              className="mr-sm-2 form-control search"
              onChange={(e) => textChanged(e.target.value)}
              placeholder="Search by Student Name"
              value={text}
            />
          </Form>
        </Nav.Item>
      </FooterLeft>
      <ScrollableFooterRight scrollableWidth={500}>
        {searchResults.map(
          ({ show, student }) =>
            show && (
              <Nav.Item key={student.student_id}>
                <Link to={`/students/${student.student_id}`}>
                  {student.student_name}
                </Link>
              </Nav.Item>
            )
        )}
      </ScrollableFooterRight>
    </>
  );
};

export default SearchMain;
