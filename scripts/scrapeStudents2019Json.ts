import axios from 'axios';
import * as fs from 'fs';
import {promisify} from 'util';
import { join } from 'path';

const writeFile = promisify(fs.writeFile);

const main =
    async () => {
  const allStudentsJson =
      (await axios.get(
           'https://itp.nyu.edu/thesis2019/data/data.json'))
          .data;

  const studentIds = allStudentsJson.map(({student_id}: {student_id: string}) => student_id);

  for (let i = 0; i < studentIds.length; i++) {
    const studentId = studentIds[i];
    console.log('scraping student id ', studentId);
    const studentIdJson =
        (await axios.get(
             `https://itp.nyu.edu/thesis2019/data/students/student${
                 studentId}.json`))
            .data;

    const destination = join(process.cwd(), 'public/2019', `${studentId}.json`);

    console.log('destination', destination);

    await writeFile(destination, JSON.stringify(studentIdJson));
  }
}

main();
