import React, { useCallback, useEffect, useContext, useState } from "react";
import { animated as a } from "react-spring";
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

interface AnimationState {
  height: number;
  titleAnimation: number;
}

const animationDuration = 1.5;

const HeaderSpring = ({
  collapse,
  isAtHomePage,
  addMessage,
}: IHeaderSpringProps) => {
  const { windowSize, navigatorPlatform } = useContext(Context);
  const windowHeight = windowSize[1];
  const [animation, setAnimation] = useState<AnimationState>({
    height: 0,
    titleAnimation: 0,
  });

  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  useEffect(() => {
    setAnimation((prevState) => ({
      ...prevState,
      height: HEADER_HEIGHT_IN_VH,
    }));

    setTimeout(() => {
      setAnimationComplete(true);
    }, animationDuration * 1000);
  }, []);

  const collapseHeaderAndShowMessage = useCallback(() => {
    //@ts-ignore
    setAnimation({
      height: 0,
      titleAnimation: 1,
    });

    if (collapse && isAtHomePage && !navigatorPlatform?.isMobile)
      addMessage(
        `Drag ${
          navigatorPlatform?.isMac ? "or scroll " : ""
        }to explore, click to Read More.`,
        true
      );
  }, [collapse, addMessage, isAtHomePage, navigatorPlatform]);

  useEffect(collapseHeaderAndShowMessage, [collapse]);

  useEffect(() => {
    setHtmlOverscrollBehaviorX(isAtHomePage ? "none" : "auto");
  }, [isAtHomePage]);

  useEffect(() => {
    setAnimation({
      height: collapse
        ? 0
        : HEADER_HEIGHT_IN_VH - pxToVh(document.body.scrollTop, windowHeight),
      titleAnimation: 1,
    });
  }, [windowHeight, collapse]);

  const Rolling20Props: IRolling20Props = {
    heightInVh: animation.height,
    rows: BG_ROWS,
    speed: BG_SCROLL_SPEED,
    targetVH: HEADER_HEIGHT_IN_VH,
  };

  return !isAtHomePage ? null : (
    <a.div
      id="header2020-container"
      style={{
        height: `${animation.height}vh`,
      }}
    >
      <AnimatedTitle
        classNames={"position-absolute"}
        AnimatedTag={a.h1}
        title={`THESIS\nARCHIVE`}
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
