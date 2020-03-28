// {"name":"Performance","slug":"performance"},{"name":"Society","slug":"society"}]
export const getTopics = students =>
  students.reduce((allTopics, { topics }) => {
    for (let topic of topics) {
      const { slug, name } = topic;
      if (!allTopics[slug]) {
        allTopics[slug] = name;
      }
    }
    return allTopics;
  }, {});
