import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "../types";
import { Card, CardColumns } from "react-bootstrap";
import { shuffle } from "../util/queries";
import { useSpring, animated, to, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { addVector, scaleVector } from "../util/vector";
import Student from "../Student";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
}

const DragableCards = ({ students }: IStudentsProps) => {
  const canvasSize = 3000;
  const [{ pos }, set] = useSpring(() => ({ pos: [0, 0] }));
  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      if (down) {
        set({
          pos: xy,
          config: { velocity: scaleVector(direction, velocity), decay: false },
        });
      } else {
        console.log(xy);
        const to = addVector(xy, scaleVector(direction, velocity * 50));
        console.log(to);
        set({
          pos: to,
          config: { velocity: scaleVector(direction, velocity), decay: false },
        });
      }
    },
    {
      initial: () => pos.getValue() as any,
    }
  );
  return (
    <>
      <div id="canvas-invisible-height" />
      <div id="canvas-container">
        <animated.div
          {...bind()}
          id="projects-canvas"
          style={{
            transform: to([pos], ([x, y]) => `translate3d(${x}px,${y}px,0)`),
          }}
        >
          {students &&
            students.map((student) => (
              <StudentCard key={student.student_slug} student={student} />
            ))}
        </animated.div>
      </div>
    </>
  );
};

const StudentCard = ({ student }: { student: IStudentSummary }) => (
  // <Link to={`/students/${student.student_id}`}>
  <div
    className="project-card shadow"
    style={{ backgroundImage: `url(${student.portfolio_icon.src})` }}
  >
    {/* <Card.ImgOverlay>
                    <Card.Title>{student.student_name}</Card.Title>
                    <Card.Text>{student.project_title}</Card.Text>
                </Card.ImgOverlay> */}
  </div>
  // </Link >
);

export default DragableCards;
