const axios = require('axios');
const fs = require('fs');
const {promisify} = require('util');
const {join} = require('path');

const writeFile = promisify(fs.writeFile);

const main =
    async () => {
  const allStudentsJson =
      (await axios.get(
           'https://itp.nyu.edu/thesis2018/wp-content/themes/itpthesis/api.php?student_id=-1'))
          .data;

  const studentIds = allStudentsJson.map(({student_id}) => student_id);

  for (let i = 0; i < studentIds.length; i++) {
    const studentId = studentIds[i];
    console.log('scraping student id ', studentId);
    const studentIdJson =
        (await axios.get(
             `https://itp.nyu.edu/thesis2018/wp-content/themes/itpthesis/api.php?student_id=${
                 studentId}`))
            .data;

    const destination = join(process.cwd(), 'public/2018', `${studentId}.json`);

    console.log('destination', destination);

    await writeFile(destination, JSON.stringify(studentIdJson));
  }
}

main();
