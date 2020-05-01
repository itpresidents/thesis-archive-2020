import React, { useState, FC, useCallback, useEffect } from "react";
import { IStudentSummary } from "types";
import { useSpring, animated as a, SpringValue, config } from "react-spring";
import { useHistory } from "react-router-dom";
import Rolling20, { IRolling20Props } from "../Shared/Rolling20";
import StudentDetails from "../StudentDetails";
import { Random } from "images/Svg";
import { Navbar, Nav } from "react-bootstrap";
import { AnimatedTitle } from "components/Shared/AnimatedTitle";
import { FiX } from "react-icons/fi";

interface IRandomSpringProps {
  student: IStudentSummary;
  students: IStudentSummary[];
  reRoll: () => void;
}

const RandomSpring: FC<IRandomSpringProps> = ({
  student,
  students,
  reRoll,
}) => {
  const [redirect, setRedirect] = useState(false);
  const { student_id, student_name, project_title: title } = student;
  const history = useHistory();

  const initialSpring = {
    from: {
      curtainDown: "-100vh",
      animatedName: 0,
      titleOpacity: 0,
      finished: 0,
      detailsOpacity: 1,
    },
    to: async (next: any) => {
      next({ detailsOpacity: 0, config: config.gentle });
      next({
        animatedName: 1,
        config: { mass: 1, tension: 200, friction: 60 },
      });
      await next({ curtainDown: "0vh" });
      await next(
        (() => {
          history.replace(`/random/${student_id}`);
          return { titleOpacity: 1, config: config.slow };
        })()
      );
      next({
        curtainDown: "-100vh",
        config: { mass: 1, tension: 170, friction: 150 },
      });
      next({
        detailsOpacity: 1,
        delay: 100,
        config: { mass: 1, tension: 100, friction: 150 },
      });
    },
    onRest: () => {
      setRedirect(true);
    },
    config: { mass: 1, tension: 210, friction: 60 },
  };

  const [spring, setSpring] = useSpring(() => initialSpring);

  useEffect(() => {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    if (redirect) {
      //@ts-ignore
      setSpring({ ...initialSpring.from, immediate: true });
    }
    setTimeout(() => {
      //@ts-ignore
      setSpring(initialSpring);
    }, 100);
    // eslint-disable-next-line
  }, [student.student_id]);

  return (
    <>
      <RandomAnimation {...{ ...spring, student_name, title }} />
      {(() =>
        redirect && (
          <a.div style={{ opacity: spring.detailsOpacity }}>
            <StudentDetails students={students} />
            <ReRollButton {...{ resetHandeler: reRoll }} />
          </a.div>
        ))()}
      }
    </>
  );
};

const ReRollButton = ({ resetHandeler }: { resetHandeler: () => void }) => {
  const [hide, set] = useState(false);

  return hide ? null : (
    <>
      <Navbar fixed="bottom" bg="white" className="footer show">
        <Nav
          style={{
            width: "100%",
            display: "grid",
            gridTemplate: "100% / 64px 1fr 64px ",
          }}
        >
          <Nav.Item style={{ gridArea: "1/2/2/3" }} className="mx-auto">
            <a
              href="#top"
              className="text-center mx-auto"
              onClick={resetHandeler}
            >
              <Random />
              Random
            </a>
          </Nav.Item>
          <Nav.Item className="h-100 mx-auto" style={{ gridArea: "1/3/2/4" }}>
            <div onClick={() => set(true)}>
              <FiX size={28} />
            </div>
          </Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
};

interface IRandomAnimationProps {
  curtainDown: SpringValue<string>;
  animatedName: SpringValue<number>;
  titleOpacity: SpringValue<number>;
  finished: SpringValue<number>;
  student_name: string;
  title: string;
}

const Rolling20Props: IRolling20Props = {
  heightInVh: 100,
  rows: 3,
  speed: 0.1,
};

const RandomAnimation: FC<IRandomAnimationProps> = ({
  titleOpacity,
  title,
  finished,
  curtainDown,
  animatedName,
  student_name,
}) => (
  <>
    <a.div
      className="random-container"
      style={{
        top: curtainDown,
      }}
    >
      <AnimatedTitle {...{ spring: animatedName, title, AnimatedTag: a.h2 }} />
      <a.h3 style={{ opacity: titleOpacity }}>{student_name}</a.h3>
      <div className="position-absolute">
        <Rolling20 {...Rolling20Props} />
      </div>
    </a.div>
  </>
);

interface IRandomMainProps {
  students: IStudentSummary[];
}

const RandomMain: FC<IRandomMainProps> = ({ students }) => {
  const [student, setRandomStudent] = useState<IStudentSummary>(
    students[Math.floor(Math.random() * students.length)]
  );
  const reRoll = useCallback(() => {
    setRandomStudent(students[Math.floor(Math.random() * students.length)]);
  }, [students]);
  return <RandomSpring {...{ student, students, reRoll }} />;
};

const nullGuard = ({
  students,
}: {
  students: IStudentSummary[] | undefined;
}) => {
  if (!students) return <h1>Loading...</h1>;
  return <RandomMain {...{ students }} />;
};

export default nullGuard;
