import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "../types";
import { useSpring, animated, to, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { addVector, scaleVector, clampVector } from "../util/vector";
import Student from "../Student";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
}

const DragableCards = ({ students }: IStudentsProps) => {
  const [{ canvasHeight }, setState] = useState({ canvasHeight: 3000 });
  const canvasWidth = 3000;
  const [{ pos }, set] = useSpring(() => ({ pos: [-canvasWidth / 3, 0] }));
  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      console.log(xy);
      set({
        pos: addVector(xy, scaleVector(direction, velocity * 100)),
        config: {
          velocity: scaleVector(direction, velocity * 10000),
          decay: false,
        },
      });
    },
    {
      initial: () => pos.getValue() as any,
      bounds: {
        left: -canvasWidth + window.innerWidth * 0.8,
        right: 200,
        top: -canvasHeight + window.innerHeight * 0.8,
        bottom: 200,
      },
      rubberband: true,
    }
  );
  useEffect(() => {
    const canvasH = document.getElementById("projects-canvas")!.clientHeight;
    setState({ canvasHeight: canvasH });
  }, []);

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
