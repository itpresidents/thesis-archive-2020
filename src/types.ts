export interface ITopic {
  slug: string;
  name: string;
}

export declare type StringDict = { [key: string]: string };

export interface IStudentSummary {
  topics: ITopic[];
  student_id: string;
  student_name: string;
}

export interface IFeaturedImage {
  src: string;
  alt: string;
  title: string;
}

export interface Slide {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export interface IStudentDetails extends IStudentSummary {
  featured_image: IFeaturedImage[];
  project_question: string;
  advisor_name: string;
  project_title: string;
  slide_show: Slide[];
  further_reading: string;
}

export interface IStudentApi {
  getAllStudents: () => Promise<IStudentSummary[]>;
  getStudent: (studentId: string) => Promise<IStudentDetails>;
}
