import React, { useEffect, useState, useReducer } from "react";
import * as api from "util/api";
import "scss/styles.scss";
import Explore from "./Explore/Explore";
import StudentDetails from "./StudentDetails";
import { Switch, Route } from "react-router-dom";
import { IStudentSummary, ICentralStore } from "types";
import Header from "./Shared/Header";
import Videos from "./Videos/Videos";
import { Context } from "../util/contexts";
import useWindowSize from "../util/useWindowSize";
import { isMobile } from "react-device-detect";
import { FirstClicked } from "./Shared/FirstClicked";
import { rootReducer } from "util/homemadeRedux/reducers";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const navigatorPlatform = {
  label: window.navigator.platform,
  isMac: window.navigator.platform.toUpperCase().indexOf("MAC") >= 0,
  isIOS: /(iPhone|iPod|iPad)/i.test(window.navigator.platform),
  isMobile: isMobile,
};

const initialCentralStore: ICentralStore = {
  messages: [],
};

const App = ({ students }: IAppProps) => {
  const windowSize = useWindowSize();
  const [hasStartedExploring, setHasStartedExploring] = useState<boolean>(
    false
  );

  const [centralStore, dispatch] = useReducer(rootReducer, initialCentralStore);

  return (
    <>
      <Context.Provider
        value={{ windowSize, navigatorPlatform, centralStore, dispatch }}
      >
        <Header hasStartedExploring={hasStartedExploring} />
        <Switch>
          <Route path="/students/:studentIdOrSlug">
            <StudentDetails students={students} />
          </Route>
          <Route path="/videos/:studentSlug?">
            <Videos students={students} />
          </Route>
          <Route path="/">
            <>
              <FirstClicked firstClicked={() => setHasStartedExploring(true)} />
              <Explore students={students} isExploring={hasStartedExploring} />
            </>
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
