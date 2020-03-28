export interface ITopic {
  slug: string;
  name: string;
}

export declare type TopicDict = { [key: string]: string };

export interface IStudentSummary {
  student_id: string;
  student_name: string;
  student_slug: string;
  advisor_slug: string;
  topics: ITopic[];
  project_title: string;
  project_question: string;
  portfolio_icon: Image;
}

export interface IFeaturedImage {
  src: string;
  alt: string;
  title: string;
}

export interface Image {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export interface IStudentDetails extends IStudentSummary {
  featured_image: IFeaturedImage[];
  advisor_name: string;
  slide_show: Image[];
  short_description: string;
  further_reading: string;
  video_presentation_url: string;
}

export interface IStudentApi {
  getAllStudents: () => Promise<IStudentSummary[]>;
  getStudent: (studentId: string) => Promise<IStudentDetails>;
}
