import React, { FC, useContext } from "react";
import { Context as myContext } from "../contexts";
import { ICentralStore } from "types";

type mapStateToProps = ((state: ICentralStore) => any) | null;
type mapDispatchToProps = ((dispatch: React.Dispatch<any>) => any) | null;

export const connect = <TProp extends Object>(
  mapStateToProps: mapStateToProps,
  mapDispatchToProps: mapDispatchToProps
) => (Component: any): FC<TProp> => (props: TProp) => {
  const { centralStore, dispatch } = useContext(myContext);
  const mappedState = mapStateToProps ? mapStateToProps(centralStore) : {};
  const mappedDispatchs = mapDispatchToProps
    ? mapDispatchToProps(dispatch!)
    : {};
  props = { ...props, ...mappedState, ...mappedDispatchs };
  return <Component {...props} />;
};
