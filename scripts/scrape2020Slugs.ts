import axios from "axios";
import { promisify} from 'util';
import * as fs from 'fs';
import { join, resolve } from 'path'

const writeFile = promisify(fs.writeFile);

const scrape2020Slugs = async () => {
  const students = (await axios.get("https://itp.nyu.edu/thesis2020/api.php?student_id=-1")).data as {
    student_id: string
  }[];
  const studentIdsAndSlugs: {id: string, slug: string}[] = [];


  for(let i = 0; i < students.length; i++) {
    console.log('getting student', i);
    const student_id = students[i].student_id;
    const {student_slug}= (await axios.get(`https://itp.nyu.edu/thesis2020/api.php?student_id=${student_id}`)).data as {student_slug: string};
    console.log('got result', student_id, student_slug);

    studentIdsAndSlugs.push({
      id: student_id,
      slug: student_slug 
    });
  }
  
  const destinationFile = resolve(join(__dirname, '../src/scrapedSchedules/slugs.json'));

  await writeFile(destinationFile, JSON.stringify({idsAndSlugs: studentIdsAndSlugs}, null, 2));
}

scrape2020Slugs();