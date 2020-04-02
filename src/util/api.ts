import axios from "axios";
import * as config from "config";
import { IStudentApi, IStudentDetails, IStudentSummary } from "types";

export const getAllStudents = () => getApi().getAllStudents();
export const getStudent = (studentId: string) => getApi().getStudent(studentId);

const getApi = (): IStudentApi => {
  if (config.api === config.apis.FAKE_FROM_2018) {
    return fake2018Api;
  } else {
    return realApi;
  }
};

const baseApiUrl =
  "https://itp.nyu.edu/thesis2018/wp-content/themes/itpthesis/api.php";

const realApi: IStudentApi = {
  getAllStudents: async () =>
    (await axios.get(`${baseApiUrl}?student_id=-1`)).data as IStudentSummary[],
  getStudent: async (studentId: string) =>
    (await axios.get(`${baseApiUrl}?student_id=${studentId}`))
      .data as IStudentDetails,
};

const fake2018Api: IStudentApi = {
  getAllStudents: async () =>
    (await axios.get("/2019/all.json")).data as IStudentSummary[],
  getStudent: async (studentId) =>
    (await axios.get(`/2019/${studentId}.json`)).data as IStudentDetails,
};

// sample json for students:
// {
//   student_id: "40",
//   student_name: "Akmyrat Tuyliyev",
//   student_slug: "akmyrat-tuyliyev",
//   advisor_id: "119",
//   project_title: "Erteki: Storytelling by Children",
//   project_question: "<i>Erteki</i> means fairy tale in Turkmen. Fairy tales
//   are stories that were told to children as a way to teach in indirect,
//   fanciful and metaphorical ways how to grow up in their culture. But in the
//   21st century, mass media entertainment has become the primary source for
//   children’s development and how they perceive the world. <br /> <br />
//   Unfortunately, there has been a significant lack of representation of
//   marginalized communities in the mainstream media for decades. Increasingly
//   people are speaking out about not seeing a representation of themselves on
//   television or in movies when growing up. As a Turkmen filmmaker and a new
//   media artist, this issue was undoubtedly part of my own childhood. I found
//   it troubling to see that the problems are presently stressed via
//   conversation, but not much is done to solve them. For my thesis, I had to
//   ask myself: is it possible to create a narrative experience that tells a
//   unique and meaningful story to every individual user, tailored to their
//   culture? <br /> <br /> I decided to start with a culture I know best, my
//   own. I reached out to the small Turkmen community in NYC and found many
//   Turkmen-American children, who are in the midst of developing their
//   identity. After my research with children, I realized that I had to put
//   media in children’s hands, and give them a voice to represent their own
//   stories and experiences. I developed an immersive installation
//   <i>Erteki</i>, which listens to children’s stories and illustrates them
//   live, using speech recognition, machine learning and projection.
//   <i>Erteki</i>, or fairy tale, is designed to make stories and characters
//   come to life in a magical experience. By providing a platform that empowers
//   children with authorship over their own narratives, I hope that they grow
//   up feeling included and visible. ", short_description: "<i>Erteki</i> is an
//   immersive space for children from marginalized communities to tell their
//   stories and experience their narratives coming alive.", portfolio_icon: {
//   src:
//   "https://itp.nyu.edu/thesis2018/wp-content/uploads/2018/04/baby_thumbnail.png",
//   title: "Erteki Thumbnail",
//   alt: "A baby boy looking into a bright screen",
//   caption: "Erteki thumbnail"
//   },
//   topics: [
//   {
//   name: "Identity",
//   slug: "identity"
//   },
//   {
//   name: "Narrative",
//   slug: "narrative"
//   }
//   ]
//   },
