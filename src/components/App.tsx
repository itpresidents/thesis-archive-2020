import React, { useEffect, useState } from "react";
import * as api from "util/api";
import "scss/styles.scss";
import Explore from "./Explore";
import StudentDetails from "./StudentDetails";
import { Switch, Route } from "react-router-dom";
import { IStudentSummary } from "types";
import Header from "./Header";
import Videos from "./Videos";
import { Context } from "../util/contexts";
import useWindowSize from "../util/useWindowSize";
import { isMobile } from "react-device-detect";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const navigatorPlatform = {
  label: window.navigator.platform,
  isMac: window.navigator.platform.toUpperCase().indexOf("MAC") >= 0,
  isIOS: /(iPhone|iPod|iPad)/i.test(window.navigator.platform),
  isMobile: isMobile,
};

const App = ({ students }: IAppProps) => {
  const windowSize = useWindowSize();
  return (
    <>
      <Context.Provider value={{ windowSize, navigatorPlatform }}>
        <Header />
        <Switch>
          <Route path="/students/:studentIdOrSlug">
            <StudentDetails students={students} />
          </Route>
          <Route path="/videos/:studentSlug?">
            <Videos students={students} />
          </Route>
          <Route path="/">
            <Explore students={students} />
          </Route>
        </Switch>
      </Context.Provider>
    </>
  );
};

const AppContainer = () => {
  const [students, setStudents] = useState<IStudentSummary[]>();
  useEffect(() => {
    async function fetchAllStudents() {
      const students = await api.getAllStudents();
      setStudents(students);
    }
    fetchAllStudents();
  }, []);

  return <App students={students} />;
};

export default AppContainer;
