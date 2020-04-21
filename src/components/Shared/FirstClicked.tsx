import React, { useEffect } from "react";
import { useFirstClick } from "util/useFirstClick";

export const FirstClicked = ({
  firstClicked,
}: {
  firstClicked: () => void;
}) => {
  const didFirstClick = useFirstClick();

  useEffect(() => {
    if (didFirstClick && firstClicked) {
      firstClicked();
    }
  }, [didFirstClick, firstClicked]);

  return <></>;
};
