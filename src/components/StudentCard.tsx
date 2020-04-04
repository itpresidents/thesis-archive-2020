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
    const width = `${cardSize[0] - 20}px`;
    const height = `${cardSize[1] - 120}px`;
    return (
      <div
        className="student-card shadow"
        style={{
          position: "absolute",
          width: width,
          height: height,
          left: `${offsets[0]}px`,
          top: `${offsets[1]}px`,
          backgroundImage: `url(${student.portfolio_icon.src})`,
        }}
      >
        <Link to={`/students/${student.student_id}`}>
          <div
            style={{
              height: height,
            }}
          ></div>
          <div
            className="mt-2"
            style={{
              height: `${100}px`,
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                color: "black",
                fontWeight: 700,
              }}
            >
              {student.project_title}
            </h3>
            <h5
              style={{
                fontSize: "13px",
                color: "black",
                fontWeight: 700,
              }}
            >
              {student.student_name}
            </h5>
            <p
              style={{
                fontSize: "9px",
                color: "gray",
                fontWeight: 500,
              }}
            >
              {student.topics.map((topic, index) =>
                index === student.topics.length - 1
                  ? topic.name
                  : topic.name + ", "
              )}
            </p>
          </div>
        </Link>
      </div>
    );
  }
);

export default StudentCard;
