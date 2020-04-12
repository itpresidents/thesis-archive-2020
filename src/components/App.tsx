import React, { useEffect, useState, createContext } from "react";
import * as api from "util/api";
import "scss/styles.scss";
import Explore from "./Explore";
import StudentDetails from "./StudentDetails";
import { Switch, Route } from "react-router-dom";
import { IStudentSummary } from "types";
import Header from "./Header";
import Videos from "./Videos";
import NotFound from "./NotFound";
import { Context } from "../util/contexts";
import useWindowSize from "../util/useWindowSize";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  const windowSize = useWindowSize();
  return (
    <>
      <Context.Provider value={{ windowSize }}>
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
