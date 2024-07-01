const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); // Import path module

async function Scrape() {
  try {
    const URL = 'https://www.jomashop.com/automatic-watches.html?gender=Men%27s%7CUnisex';
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--window-size=1920,1080',
      ],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.goto(URL, {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    // Custom delay function
    const delay = (time) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    // Wait for 3 seconds
    await delay(3000);

    // Click the popup close button
    try {
      await page.click('button.ltkpopup-close');
      console.log('Popup closed');
    } catch (error) {
      console.log('No popup to close');
    }

    let pagesToScrape = 3;
    let currentPage = 1;
    let data = [];

    while (currentPage <= pagesToScrape) {
      // Wait for 3 seconds before scraping
      await delay(3000);

      let newResults = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('.productItem');

        items.forEach((item) => {
          try {
            if (item.querySelector('div.productItemBlock')) {
              results.push({
                title: item.querySelector('.name-out-brand').innerText,
                img: item.querySelector('div.productImageBlock img.productImg').src,
                url: item.querySelector('div.product-details a.productName-link').href,
                price_old: item.querySelector('div.product-details div.was-wrapper').innerText,
                price_new: item.querySelector('div.product-details div.now-price').innerText,
              });
            }
          } catch (error) {
            console.error(error);
          }
        });
        return results;
      });

      data = data.concat(newResults);
      if (currentPage < pagesToScrape) {
        // Wait for 3 seconds before clicking the next page
        await delay(3000);
        if (currentPage == 1) {
          await page.waitForSelector('a.page-link');
          await page.click('a.page-link');
        } else {
          await page.waitForSelector('a.page-link[aria-label="Pagination next"]');
          await page.click('a.page-link[aria-label="Pagination next"]');
        }
      }
      currentPage++;
    }
    await browser.close()

    let csvContent = data.map(element => {
      return Object.values(element).map(item => `"${item}"`).join(',')
    }).join("\n")

    // Adjusted outputPath to save the file in the watch-prices-app/public directory
    const outputPath = path.join(__dirname, '..', 'watch-prices-app', 'public', 'Watches.csv');

    fs.writeFile(outputPath, "Title,Img,Url,Price_old,Price_new" + '\n' + csvContent, 'utf8', function (err) {
      if (err) {
        console.log('Some error occurred - file either not saved or corrupted.')
      } else {
        console.log('File saved successfully in public folder');
      }
    })
  }
  catch (error) {
    console.error(error)
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

Scrape();
