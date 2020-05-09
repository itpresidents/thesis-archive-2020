import puppeteer from "puppeteer";

interface Result {name: string | null, position: string | null, url: string | null};

const scrapePeoplePage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  console.log('scraping faculty page from ', url);

  const evalResults: Result[] = await page.evaluate(() => {
    const parsePortrait = (portraitItem: Element): Result => {
      const linkElement = portraitItem.querySelector('a');

      const url = linkElement && linkElement.href;

      const nameElement = portraitItem.querySelector('.portrait-title a');

      const name = nameElement && nameElement.innerHTML;

      const positionElement = portraitItem.querySelector('.portrait-subtitle');

      const position = positionElement && positionElement.innerHTML;

      return {
        url,name,position
      };
    };

    const portraitItems = document.querySelectorAll('.portrait-item');

    const results  = Array.from(portraitItems).map(element => parsePortrait(element));

    return results;
  });

  console.log(evalResults);
}

const main = async () => {
  await scrapePeoplePage('https://tisch.nyu.edu/itp/itp-people/staff');
};

main();