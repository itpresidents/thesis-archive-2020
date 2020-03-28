import puppeteer from "puppeteer";
import { join, resolve} from 'path';
import { promisify} from 'util';
import * as fs from 'fs';

interface Student {
  name: string;
  slug: string;
};

interface RowContents {
  time: string,
  tuesday?: Student,
  wednesday?: Student,
  thursday?: Student,
  friday?: Student
}

const writeFile = promisify(fs.writeFile);


const scrapeSchedule = async (url: string, destinationFileName: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  console.log('scraping schedule from ', url);

  const evalResults: RowContents[] | null = await page.evaluate(() => {
    const parseStudentColumn = (column: HTMLTableCellElement): Student | undefined => {
      const link = column.querySelector('a');

      if (!link) return;

      const linkParts = link.href.split('/');
      const slug = linkParts[linkParts.length - 1];

      return {
        name: link.innerText,
        slug
      }
    };

    const parseContents = (rowElement: Element): RowContents => {
      const columns = rowElement.querySelectorAll('td');


      return {
        time: columns[0].innerText,
        tuesday: parseStudentColumn(columns[1]),
        wednesday: parseStudentColumn(columns[2]),
        thursday: parseStudentColumn(columns[3]),
        friday: parseStudentColumn(columns[4])
      }
    };

    const dailyScheduleTable = document.querySelector(
      "#schedule-holder table:last-child"
    );

    if (!dailyScheduleTable) return null;

    const rows = dailyScheduleTable.querySelectorAll('tbody tr');

    const rowContents: RowContents[] = [];

    for(let i = 0; i < rows.length; i++) {
      rowContents.push(parseContents(rows[i]));
    }

    return rowContents;
  });

  const desinationFile = resolve(join(__dirname, '../public/', destinationFileName));

  console.log('writing schedule to ', desinationFile);

  await writeFile(desinationFile, JSON.stringify({
    schedule: evalResults
  }, null, 2));

};

scrapeSchedule("https://itp.nyu.edu/shows/thesis2018/", "schedule-2018.json");
