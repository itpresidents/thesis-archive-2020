import React, { useRef, useState } from "react";
import { IStudentSummary, ICardSize, ICentralStore } from "types";
import { Link } from "react-router-dom";
import {
  animated as a,
  useTransition,
  config as SpringConfig,
} from "react-spring";
import { connect } from "util/homemadeRedux/connect";
import { Diff } from "utility-types";

const DEBUG = false;

interface ICardTransitionProps {
  student: IStudentSummary;
  x: number;
  y: number;
  skipAnimation: boolean;
  cardSize: ICardSize;
}
export const StudentCardWithTransition = React.memo(
  ({ student, x, y, skipAnimation, cardSize }: ICardTransitionProps) => {
    DEBUG && console.log("re-render CardTransition");
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

interface IStudentCardProps {
  student: IStudentSummary;
  cardSize: ICardSize;
}

const StudentCard = React.memo(({ student, cardSize }: IStudentCardProps) => {
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
      className="student-card"
      style={{
        width: cardSize.width,
        height: cardSize.height,
      }}
    >
      <Link
        to={`/students/${student.student_id}`}
        ref={linkRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <CardContent {...{ student, cardSize }} />
      </Link>
    </div>
  );
});

const CardContent = React.memo(({ student, cardSize }: IStudentCardProps) => (
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
    <div className="card-info mt-2" style={{ height: cardSize.infoHeight }}>
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

const mapStateToProps = (state: ICentralStore) => ({
  cardSize: state.cardSize,
});

type diffedPropType = Diff<ICardTransitionProps, { cardSize: ICardSize }>;

export const ConnectedStudentCardWithTransition = connect<diffedPropType>(
  mapStateToProps,
  null
)(StudentCardWithTransition);
export default StudentCard;
