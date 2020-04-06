import React, { useRef, useState } from "react";
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
    const width = `${cardSize[0] * 0.75}px`;
    const height = `${(cardSize[0] - 70) * 1.4}px`;
    const linkRef = useRef<null | HTMLAnchorElement | any>(null);
    const [isDragging, setDragging] = useState<boolean>(false);
    const onClick = (e: React.FormEvent<HTMLAnchorElement>): void => {
      if (isDragging) e.preventDefault();
    };
    let clickStartXy = [0, 0];
    const onMouseDown = (e: React.MouseEvent) => {
      if (!linkRef.current) return;
      clickStartXy = [e.clientX, e.clientY];
    };
    const onMouseUp = (e: React.MouseEvent) => {
      if (!linkRef.current) return;
      const dist = Math.hypot(
        e.clientX - clickStartXy[0],
        e.clientY - clickStartXy[1]
      );
      if (dist > 10) setDragging(true);
      else setDragging(false);
    };
    return (
      <div
        className="student-card position-absolute"
        style={{
          width: width,
          height: height,
          left: `${offsets[0]}px`,
          top: `${offsets[1]}px`,
          backgroundImage: `url(${
            student.thumbnail_image && student.thumbnail_image.src
          })`,
        }}
      >
        <Link
          to={`/students/${student.student_id}`}
          ref={linkRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={onClick}
        >
          <div
            style={{
              height: height,
            }}
          ></div>
          <div
            className="card-info mt-2"
            style={{ height: `${cardSize[0] * 0.4}px` }}
          >
            <h3>{student.title}</h3>
            <h5>{student.student_name}</h5>
            <p>
              {student.tags.map((tag, index) =>
                index === student.tags.length - 1
                  ? tag.name.toUpperCase()
                  : tag.name.toUpperCase() + ", "
              )}
            </p>
          </div>
        </Link>
      </div>
    );
  }
);

export default StudentCard;
