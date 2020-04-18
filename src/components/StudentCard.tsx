import React, { useRef, useState } from "react";
import { IStudentSummary } from "../types";
import { cardSize, DEBUG } from "../config";
import { Link } from "react-router-dom";
import {
  animated as a,
  useTransition,
  config as SpringConfig,
} from "react-spring";

interface IStudentCardProps {
  student: IStudentSummary;
}

const width = `${cardSize[0] * 0.75}px`;
const height = `${(cardSize[0] - 70) * 1.4}px`;

interface ICardTransitionProps {
  student: IStudentSummary;
  x: number;
  y: number;
  skipAnimation: boolean;
}
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
    <div
      className="student-card"
      style={{
        width: width,
        height: height,
      }}
    >
      <Link
        to={`/students/${student.student_id}`}
        ref={linkRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        <CardContent student={student} />
      </Link>
    </div>
  );
});

const CardContent = React.memo(({ student }: IStudentCardProps) => (
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
      <h5>{student.student_name}</h5>
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

// const TransitionStudentCard = React.memo(({ student }: IStudentCardProps) => {
//   const transition = useTransition({
//     from: { opacity: 0.5, rotateY: 90, dead: 1 },
//     enter: () => async (next, stop) => {
//       await next({ opacity: 1, rotateY: 0, config });
//     },
//     leave: () => async () => {
//       await next({ opacity: 0, rotateY: -90, config });
//       await next({ dead: 0, config });
//     },
//     trail: 10,
//   });
// }

// const TransitionStudentCardWhenChange = React.memo(({ student }: IStudentCardProps) => {
//   const [lastStudent, setLastStudent] = useState<IStudentSummary | null>(null);
//   const [animateTransition, setAnimateTransition] = useState<boolean>(false);

//   useEffect(() => {
//     if (!lastStudent) setAnimateTransition(false);

//     setAnimateTransition(student !== lastStudent) ;
//     setLastStudent(student);
//   }, [student, lastStudent]);

//   if (animateTransition) return <TransitionStudentCard student={student} />;

//   return <StudentCard student={student} />;
// }

export default StudentCard;
