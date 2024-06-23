const puppeteer = require('puppeteer');
const fs = require('fs');

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
						if (item.querySelector('div.product-details')) {
							results.push({
								title: item.querySelector('.name-out-brand').innerText,
								url: item.querySelector('a.productName-link').href,
								price_old: item.querySelector('div.was-wrapper').innerText,
								price_new: item.querySelector('div.now-price').innerText,
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
				if(currentPage == 1){
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

		//for discount , convert string to numbers and do the formula
		// for (let i = 0; i < data.length; i++) {
		// 	price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
		// 	price_new = price_new.replace('.', ',')

		// 	price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));
		// 	price_old = price_old.replace('.', ',')

		// 	data[i].discount = (((parseInt(price_old.split(',').join('')) - parseInt(price_new.split(',').join(''))) / parseInt(price_old.split(',').join(''))) * 100).toFixed(1)
		// }

		// for top discount
		// top_discount = 0
		// position = 0
		// for (let i = 0; i < data.length; i++) {
		// 	if (parseFloat(data[i].discount) >= parseFloat(top_discount)) {
		// 		top_discount = parseFloat(data[i].discount)
		// 		position = i
		// 	}
		// }
		// data[position].top_discount = 'TOP_DISCOUNT'

		let csvContent = data.map(element => {
			return Object.values(element).map(item => `"${item}"`).join(',')
		}).join("\n")

		fs.writeFile('Watches.csv', "Title,Url,Price_old,Price_new" + '\n' + csvContent, 'utf8', function (err) {
			if (err) {
				console.log('Some error occurred - file either not saved or corrupted.')
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
