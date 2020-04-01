import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "../types";
import { useSpring, animated, to, config, SpringValue } from "react-spring";
import { useDrag } from "react-use-gesture";
import { addVector, scaleVector, multiplyElementWise } from "../util/vector";
import { CoolDown } from "../util/tools";
import Student from "../Student";
import VisibilitySensor from "react-visibility-sensor";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
}

interface IStudentCardProps {
  student: IStudentSummary;
  springValue: SpringValue<number[]>;
  xy: number[];
  wh: number[];
  offsets: number[];
  id: string;
  onChange: any;
}

interface IDragableCardsState {
  inViewPort: number[][];
  studentsMatrix: number[][];
}

const getUnvisitedNeighbors = (
  visited: number[][],
  xy: number[],
  shape: number[]
): number[][] => {
  const x = xy[0],
    y = xy[1];
  const expandVisited: number[] = [];
  visited.map((item) => {
    expandVisited.push(item[0] * shape[0] + item[1]);
  });

  var validateNeighbor = (x: number, y: number): boolean => {
    if (expandVisited.indexOf(x * shape[0] + y) === -1) return true;
    return false;
  };
  let r = [];
  if (validateNeighbor(x, y + 1)) r.push([x, y + 1]);
  if (validateNeighbor(x, y - 1)) r.push([x, y - 1]);
  if (validateNeighbor(x + 1, y)) r.push([x + 1, y]);
  if (validateNeighbor(x - 1, y)) r.push([x - 1, y]);
  return r;
};

const isInViewPort = (
  offsets: number[],
  translate: number[],
  cardSize: number[],
  tolerant: number[]
) => {
  let pos = addVector(offsets, translate);
  if (pos[0] > window.innerWidth + tolerant[0]) return false;
  else if (pos[1] > window.innerHeight + tolerant[1]) return false;
  else if (pos[0] < -cardSize[0] - tolerant[0]) return false;
  else if (pos[1] < -cardSize[1] - tolerant[1]) return false;
  else return true;
};

const DraggableCards = ({ students }: IStudentsProps) => {
  const getOffset = (xy: number[], cardSize: number[]): number[] =>
    scaleVector(multiplyElementWise(xy, cardSize), -1);
  const getProjectId = (xy: number[], shape: number[]): string =>
    `project${xy[0] * shape[0] + xy[1]}`;
  const cardSize: number[] = [240, 360];
  // the shape of the matrix. However if I have a matrix, that means this is still fake infinite.
  // There're 1 million nodes in this matrix, and the performance is still good. So this is acceptable.
  const shape: number[] = [400, 400];
  const start: number[] = scaleVector(shape, 0.5);

  const coolDown = new CoolDown(200);

  const initializeMatrix = () => {
    let r = [];
    if (students) {
      for (let i = 0; i < shape[0]; i++) {
        r.push(
          Array.from({ length: shape[1] }, () =>
            Math.floor(Math.random() * students!.length)
          )
        );
      }
    }
    return r;
  };

  const [{ inViewPort, studentsMatrix }, setState] = useState<
    IDragableCardsState
  >({ inViewPort: [start], studentsMatrix: initializeMatrix() });
  const [{ pos }, set] = useSpring(() => ({
    pos: multiplyElementWise(start, cardSize),
  }));
  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      // console.log(xy);
      set({
        pos: xy,
        config: {
          velocity: scaleVector(direction, velocity * 1000),
          decay: false,
        },
      });
    },
    {
      initial: () => pos.getValue() as any,
    }
  );

  useEffect(() => {}, []);

  const onChange = (isVisible: boolean, id: string, xy: number[]) => {
    if (coolDown.queue.length === 0) coolDown.queue = inViewPort.slice();
    if (isVisible) {
      const neighbors = getUnvisitedNeighbors(coolDown.queue, xy, shape);
      coolDown.queue = coolDown.queue.concat(neighbors);
    }
    for (let i = coolDown.queue.length - 1; i >= 0; i--) {
      const element = coolDown.queue[i];
      if (
        !isInViewPort(getOffset(element, cardSize), pos.getValue(), cardSize, [
          500,
          500,
        ])
      ) {
        coolDown.queue.splice(i, 1);
      }
    }
    // console.log(document.querySelectorAll(`.student-card`)?.length);
    console.log(inViewPort.length, coolDown.queue.length);
    coolDown.excuteSetState = () => {
      console.log("callling");
      if (!coolDown.ready()) {
        if (!coolDown.timerIsOn) {
          clearTimeout(coolDown.timeOut);
          coolDown.timeOut = setTimeout(() => {
            coolDown.excuteSetState();
          }, 200);
          coolDown.timerIsOn = true;
        }
      } else {
        clearTimeout(coolDown.timeOut);
        setState((prevState) => ({
          inViewPort: coolDown.queue,
          studentsMatrix: prevState.studentsMatrix,
        }));
        coolDown.setNow();
        coolDown.timerIsOn = false;
      }
    };
    coolDown.excuteSetState();
  };

  return (
    <>
      <div id="canvas-invisible-height" />
      <div {...bind()} id="projects-canvas" style={{}}>
        {inViewPort.map((xy: number[], index: number) => {
          return (
            <StudentCard
              id={getProjectId(xy, shape)}
              key={index}
              student={students![studentsMatrix[xy[0]][xy[1]]]}
              springValue={pos}
              xy={xy}
              wh={cardSize}
              offsets={getOffset(xy, cardSize)}
              onChange={onChange}
            />
          );
        })}
      </div>
    </>
  );
};

const StudentCard = ({
  id,
  student,
  springValue,
  xy,
  wh,
  offsets,
  onChange,
}: IStudentCardProps) => {
  let count = 0;
  const localOnChange = (visibility: boolean) => {
    onChange(visibility, id, xy);
  };
  return (
    <div id={id}>
      <animated.div
        className="student-card shadow"
        style={{
          transform: to(
            [springValue],
            ([x, y]) => `translate3d(${x}px,${y}px,0)`
          ),
          width: `${wh[0] - 20}px`,
          height: `${wh[1] - 20}px`,
          left: `${offsets[0]}px`,
          top: `${offsets[1]}px`,
          backgroundImage: `url(${student.portfolio_icon.src})`,
        }}
      >
        <VisibilitySensor
          onChange={localOnChange}
          partialVisibility={true}
          delayedCall={true}
        >
          <div
            style={{
              width: `${wh[0] - 20}px`,
              height: `${wh[1] - 20}px`,
              left: `0px`,
              top: `0px`,
            }}
          ></div>
        </VisibilitySensor>
      </animated.div>
    </div>
  );
};

export default DraggableCards;
