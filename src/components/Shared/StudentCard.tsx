import React, { useRef, useState } from "react";
import { IStudentSummary } from "../../types";
import { cardSize, DEBUG } from "../../config";
import { Link } from "react-router-dom";
import {
  animated as a,
  useTransition,
  config as SpringConfig,
} from "react-spring";
import cx from "classnames";

interface IStudentCardProps {
  student: IStudentSummary;
}

interface ICardTransitionProps {
  student: IStudentSummary;
  x: number;
  y: number;
  skipAnimation: boolean;
}

const width = cardSize[0] * 0.75;
const height = cardSize[0] * 1.1;

export const StudentCardWithTransition = React.memo(
  ({ student, x, y, skipAnimation }: ICardTransitionProps) => {
    DEBUG && console.log("re-render CardTransition");
    const transition = useTransition(student, {
      key: student.student_id,
      from: { opacity: 1 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: SpringConfig.slow,
    });
    return (
      <>
        {transition((style, student) => {
          const anim = skipAnimation ? {} : style;
          return (
            <a.div
              key={student.student_id}
              style={{
                ...anim,
                position: "absolute",
                width: width,
                height: height,
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              <StudentCard key={student.student_id} student={student} />
            </a.div>
          );
        })}
      </>
    );
  }
);

export const CardOuter = ({
  width,
  height,
  children,
  className,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cx("student-card", className)}
    style={{
      width: width,
      height: height,
    }}
  >
    {children}
  </div>
);

const StudentCard = React.memo(({ student }: IStudentCardProps) => {
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
    <CardOuter width={width} height={height}>
      <Link
        to={`/students/${student.student_id}`}
        ref={linkRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <CardContent student={student} />
      </Link>
    </CardOuter>
  );
});

export const CardContent = React.memo(({ student }: IStudentCardProps) => (
  <>
    <div className="card-bg-frame">
      <div
        className="card-bg"
        style={{
          backgroundImage: `url(${
            student.thumbnail_image && student.thumbnail_image.src
          })`,
        }}
      />
    </div>
    <div
      className="card-info mt-2"
      style={{ height: `${cardSize[0] * 0.4}px` }}
    >
      <h3>{student.title}</h3>
      <h4>{student.student_name}</h4>
      <p>
        {student.tags.map((tag, index) =>
          index === student.tags.length - 1
            ? tag.name.toUpperCase()
            : tag.name.toUpperCase() + ", "
        )}
      </p>
    </div>
  </>
));
