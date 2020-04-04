import puppeteer from "puppeteer";
import { join, resolve} from 'path';
import { promisify} from 'util';
import * as fs from 'fs';
import {VideoScheduleRowContents, VideoScheduleStudent } from '../src/types';

const writeFile = promisify(fs.writeFile);


const scrapeSchedule = async (url: string, destinationFileName: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  console.log('scraping schedule from ', url);

  const evalResults: VideoScheduleRowContents[] | null = await page.evaluate(() => {
    const parseStudentColumn = (column: HTMLTableCellElement | undefined): VideoScheduleStudent | undefined => {
      if (!column) return undefined;
      const link = column.querySelector('a');

      if (!link) return;


      const name = link.innerText;
      
      const slug = name.toLowerCase().replace(' ', '-');

      return {
        name,
        slug
      }
    };

    const parseContents = (rowElement: Element): VideoScheduleRowContents => {
      const columns = rowElement.querySelectorAll('td');
      const numColumns = columns.length;

      const tuesdayColumn = numColumns === 5 ? 1 : -1;
      const wednesdayColumn = numColumns === 5 ? 2 : -1;
      const thursdayColumn = numColumns === 5 ? 3 : -1;
      const fridayColumn = numColumns === 5 ? 4 : 1;

      return {
        time: columns[0].innerText,
        tuesday: parseStudentColumn(columns[tuesdayColumn]),
        wednesday: parseStudentColumn(columns[wednesdayColumn]),
        thursday: parseStudentColumn(columns[thursdayColumn]),
        friday: parseStudentColumn(columns[fridayColumn])
      }
    };

    const dailyScheduleTable = document.querySelector(
      "article table:last-child"
    );

    if (!dailyScheduleTable) return null;

    const rows = dailyScheduleTable.querySelectorAll('tbody tr:not(:first-child)');

    const rowContents: VideoScheduleRowContents[] = [];

    for(let i = 0; i < rows.length; i++) {
      rowContents.push(parseContents(rows[i]));
    }

    return rowContents;
  });

  const desinationFile = resolve(join(__dirname, '../src/scrapedSchedules/', destinationFileName));

  console.log('writing schedule to ', desinationFile);

  await writeFile(desinationFile, JSON.stringify({
    schedule: evalResults
  }, null, 2));

};

scrapeSchedule("https://itp.nyu.edu/shows/thesis2019/", "schedule-2019.json");
