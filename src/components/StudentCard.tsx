import React from "react";
import { IStudentSummary } from "../types";
import { cardSize } from "../config";
import { scaleVector, multiplyElementWise } from "util/vector";
import { Link } from "@reach/router";

interface IStudentCardProps {
  student: IStudentSummary;
  matrixX: number;
  matrixY: number;
}

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

const StudentCard = React.memo(
  ({ student, matrixX: x, matrixY: y }: IStudentCardProps) => {
    const offsets = getOffset([x, y], cardSize);
    return (
      <div
        className="student-card shadow"
        style={{
          position: "absolute",
          width: `${cardSize[0] - 20}px`,
          height: `${cardSize[1] - 20}px`,
          left: `${offsets[0]}px`,
          top: `${offsets[1]}px`,
          backgroundImage: `url(${student.portfolio_icon.src})`,
        }}
      >
        <Link to={`/students/${student.student_id}`}>
          <div
            style={{
              width: `${cardSize[0] - 20}px`,
              height: `${cardSize[1] - 20}px`,
              left: `0px`,
              top: `0px`,
            }}
          ></div>
        </Link>
      </div>
    );
  }
);

export default StudentCard;
