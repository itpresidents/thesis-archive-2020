import React, { useCallback, useEffect, useContext } from "react";
import { useSpring, to, animated } from "react-spring";
import { Context } from "../../util/contexts";
import { connect } from "util/homemadeRedux/connect";
import { addMessageAction } from "util/homemadeRedux/actions";
import { Subtract } from "utility-types";
import Rolling20, { IRolling20Props } from "./Rolling20";

const getHeaderHeight = (windowWidth: number): number => {
  switch (true) {
    case windowWidth > 600:
      return 70;
    default:
      return 40;
  }
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
    height: HEADER_HEIGHT_IN_VH,
  }));

  const collapseHeaderAndShowMessage = useCallback(() => {
    setSpring({ height: 0 });
    collapse &&
      isAtHomePage &&
      !navigatorPlatform?.isMobile &&
      addMessage(
        `Drag ${
          navigatorPlatform?.isMac ? "or scroll " : ""
        }to explore, click to Read More.`,
        false
      );
  }, [setSpring, collapse, addMessage, isAtHomePage, navigatorPlatform]);

  useEffect(collapseHeaderAndShowMessage, [collapse]);

  useEffect(() => {
    if (isAtHomePage)
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "overscroll-behavior-x:none");
    else
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "overscroll-behavior-x:auto");
  }, [isAtHomePage]);

  useEffect(() => {
    setSpring({
      height: collapse
        ? 0
        : HEADER_HEIGHT_IN_VH - pxToVh(document.body.scrollTop, windowHeight),
    });
  }, [windowHeight, setSpring, collapse]);

  const Rolling20Props: IRolling20Props = {
    heightInVh: spring!.height,
    rows: BG_ROWS,
    speed: BG_SCROLL_SPEED,
  };

  return !isAtHomePage ? null : (
    <animated.div
      id="header2020-container"
      style={{
        height: to(spring.height, (height) => `${height}vh`),
      }}
    >
      <animated.h1
        className="position-absolute"
        style={{
          height: to(spring.height, (height) => `${height}vh`),
        }}
      >
        Thesis <br />
        Archive
      </animated.h1>
      <Rolling20 {...Rolling20Props} />
    </animated.div>
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
