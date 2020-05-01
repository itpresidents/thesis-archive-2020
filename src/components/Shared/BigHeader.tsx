import React, { useCallback, useEffect, useContext } from "react";
import { useSpring, animated as a } from "react-spring";
import { Context } from "../../util/contexts";
import { connect } from "util/homemadeRedux/connect";
import { addMessageAction } from "util/homemadeRedux/actions";
import { Subtract } from "utility-types";
import Rolling20, { IRolling20Props } from "./Rolling20";
import { AnimatedTitle } from "components/Shared/AnimatedTitle";

export const getHeaderHeight = (windowWidth: number): number => {
  switch (true) {
    case windowWidth > 600:
      return 70;
    default:
      return 40;
  }
};

const setHtmlOverscrollBehaviorX = (value: string): void => {
  document
    .getElementsByTagName("html")[0]
    .setAttribute("style", `overscroll-behavior-x:${value}`);
};

export const HEADER_HEIGHT_IN_VH = getHeaderHeight(window.innerWidth);
const BG_SCROLL_SPEED = 0.066;
const BG_ROWS = 2;

const pxToVh = (px: number, windowHeight: number): number =>
  (100 * px) / windowHeight;

interface IHeaderSpringProps {
  collapse: boolean;
  isAtHomePage: boolean;
  addMessage: (text: string, autoDisappear: boolean) => void;
}

const HeaderSpring = ({
  collapse,
  isAtHomePage,
  addMessage,
}: IHeaderSpringProps) => {
  const { windowSize, navigatorPlatform } = useContext(Context);
  const windowHeight = windowSize[1];
  const [spring, setSpring] = useSpring(() => ({
    from: {
      height: 0,
      titleAnimation: 0,
    },
    to: {
      height: HEADER_HEIGHT_IN_VH,
      titleAnimation: 1,
    },
    config: { mass: 1, tension: 200, friction: 60 },
  }));

  const collapseHeaderAndShowMessage = useCallback(() => {
    //@ts-ignore
    setSpring({ height: 0, titleAnimation: 1 });
    collapse &&
      isAtHomePage &&
      !navigatorPlatform?.isMobile &&
      addMessage(
        `Drag ${
          navigatorPlatform?.isMac ? "or scroll " : ""
        }to explore, click to Read More.`,
        true
      );
  }, [setSpring, collapse, addMessage, isAtHomePage, navigatorPlatform]);

  useEffect(collapseHeaderAndShowMessage, [collapse]);

  useEffect(() => {
    setHtmlOverscrollBehaviorX(isAtHomePage ? "none" : "auto");
  }, [isAtHomePage]);

  useEffect(() => {
    //@ts-ignore
    setSpring({
      height: collapse
        ? 0
        : HEADER_HEIGHT_IN_VH - pxToVh(document.body.scrollTop, windowHeight),
      titleAnimation: 1,
    });
  }, [windowHeight, setSpring, collapse]);

  const Rolling20Props: IRolling20Props = {
    heightInVh: spring!.height,
    rows: BG_ROWS,
    speed: BG_SCROLL_SPEED,
    targetVH: HEADER_HEIGHT_IN_VH,
  };

  return !isAtHomePage ? null : (
    <a.div
      id="header2020-container"
      style={{
        height: spring.height.to((height) => `${height}vh`),
      }}
    >
      <AnimatedTitle
        classNames={"position-absolute"}
        AnimatedTag={a.h1}
        title={`THESIS\nARCHIVE`}
        spring={spring.titleAnimation}
      />
      <Rolling20 {...Rolling20Props} />
    </a.div>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
  addMessage: (text: string, autoDisappear: boolean) =>
    dispatch(addMessageAction(text, autoDisappear)),
});

// if there're props other than mapped props,
// calculate the IOwnProps then pass to connect.
type IOwnProps = Subtract<
  IHeaderSpringProps,
  ReturnType<typeof mapDispatchToProps>
>;

export default connect<IOwnProps>(null, mapDispatchToProps)(HeaderSpring);
