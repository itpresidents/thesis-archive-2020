import React, {
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { IStudentSummary, ICardSize } from "types";
import { Link } from "react-router-dom";
import {
  animated as a,
  useTransition,
  config as SpringConfig,
} from "react-spring";
import { Context } from "util/contexts";
import cx from "classnames";
import he from "he";

const DEBUG = false;

interface ICardTransitionProps {
  student: IStudentSummary;
  x: number;
  y: number;
  skipAnimation: boolean;
}
export const StudentCardWithTransition = React.memo(
  ({ student, x, y, skipAnimation }: ICardTransitionProps) => {
    DEBUG && console.log("re-render CardTransition");
    const { cardSize } = useContext(Context);
    const transition = useTransition(student, {
      key: student.student_id,
      from: { opacity: 0 },
      enter: { opacity: 1, delay: 300 },
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
                width: cardSize.width,
                height: cardSize.height,
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              <StudentCard
                key={student.student_id}
                {...{ student, cardSize }}
              />
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

interface IStudentCardProps {
  student: IStudentSummary | undefined;
  cardSize: ICardSize;
}

export const StudentCard = ({ student, cardSize }: IStudentCardProps) => {
  const [isDragging, setDragging] = useState<boolean>(false);
  const onClick = useCallback(
    (e: React.FormEvent<HTMLAnchorElement>): void => {
      if (isDragging) e.preventDefault();
    },
    [isDragging]
  );

  const [clickStartXy, setClickStartXy] = useState([0, 0]);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setClickStartXy([e.clientX, e.clientY]);
  }, []);

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const dist = Math.hypot(
        e.clientX - clickStartXy[0],
        e.clientY - clickStartXy[1]
      );
      if (dist > 10) setDragging(true);
      else setDragging(false);
    },
    [clickStartXy]
  );

  if (!student) return null;

  return (
    <CardOuter width={cardSize.width} height={cardSize.height}>
      <Link
        to={`/students/${student.student_id}`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <CardContent {...{ student, cardSize }} />
      </Link>
    </CardOuter>
  );
};

const formatTag = (tagName: string) => he.decode(tagName.toUpperCase());

export const CardContent = ({
  student,
  cardSize,
}: {
  student: IStudentSummary;
  cardSize: ICardSize;
}) => {
  const tags = useMemo(
    () =>
      student.topics.map(({ name }, index) =>
        index === student.topics.length - 1
          ? formatTag(name)
          : formatTag(name) + ", "
      ),
    [student.topics]
  );

  return (
    <>
      {" "}
      <div className="card-bg-frame">
        <div
          className="card-bg"
          style={{
            backgroundImage: `url(${
              student.portfolio_thumbnail && student.portfolio_thumbnail.src
            })`,
            width: cardSize.width,
          }}
        />
      </div>
      <div className="card-info mt-2" style={{ height: cardSize.infoHeight }}>
        <h3>
          {useMemo(() => he.decode(student.project_title), [
            student.project_title,
          ])}
        </h3>
        <h4>{student.student_name}</h4>
        <p>{tags}</p>
      </div>
    </>
  );
};
export default StudentCard;
