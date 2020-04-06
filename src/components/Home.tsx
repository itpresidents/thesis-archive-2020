import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { RouteComponentProps, useMatch, Redirect, Router } from "@reach/router";
import { IStudentSummary, IStudentFilter } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";
import Footer, { FooterMain } from "./Footer";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
}

const Home = ({ students, path }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards students={students} width={width} height={height} />
          )}
        </ContainerDimensions>
      </div>
      <Footer />
    </Container>
  );
};

export default Home;
