import { Vector } from "./util/vector";

export interface ITag {
  slug: string;
  name: string;
}

export declare type TopicDict = { [key: string]: string };

export interface IStudentSummary {
  student_id: string;
  student_name: string;
  student_slug: string;
  advisor_name: string;
  title: string;
  thesis_statement: string;
  abstract: string;
  context_research: string;
  thumbnail_image: IImage;
  headshot_image: IImage;
  slide_show: IImage[];
  tags: ITag[];
  video_presentation_url: string;
  video_documentation_url: string;
}

export interface IFeaturedImage {
  src: string;
  alt: string;
  title: string;
}

export interface IImage {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export interface IStudentDetails extends IStudentSummary {
  technical_details: string;
  further_reading: string;
  project_url: string;
}

export interface IStudentApi {
  getAllStudents: () => Promise<IStudentSummary[]>;
  getStudent: (studentId: string) => Promise<IStudentDetails>;
}

/* Video Schedule Types */
export interface VideoScheduleStudent {
  name: string;
  slug: string;
}

export interface VideoScheduleRowContents {
  time: string;
  tuesday?: VideoScheduleStudent;
  wednesday?: VideoScheduleStudent;
  thursday?: VideoScheduleStudent;
  friday?: VideoScheduleStudent;
}

export interface CardToShow {
  student: IStudentSummary;
  matrixX: number;
  matrixY: number;
}

export declare type IStudentFilter = (student: IStudentSummary) => boolean;

type FilterStatus = "add" | "remove" | "nochange";

export interface ISearchResult {
  student_id: string;
  student_name: string;
}

export declare type ISearch = (search: string) => IStudentSummary[];

// types for homemade redux and messagehub

export interface IAction<T = null> {
  type: string;
  payload: T;
}

export interface IMessage {
  text: string;
  id: string;
  autoDisappear: boolean;
}

export type messageActionTypes =
  | IAction<IMessage>
  | IAction<IMessage["id"]>
  | IAction;

export interface ICentralStore {
  messages: IMessage[];
}

export interface IPlatform {
  label: string;
  isMac: boolean;
  isIOS: boolean;
  isMobile: boolean;
}

export interface IContext {
  centralStore: ICentralStore;
  dispatch?: React.Dispatch<any>;
  windowSize: Vector | number[];
  navigatorPlatform?: IPlatform;
}
