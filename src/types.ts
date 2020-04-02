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
  thumbnail_image: Image;
  headshot_image: Image;
  slide_show: Image[];
  tags: ITag[];
  video_presentation_url: string;
  video_documentation_url: string;
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
