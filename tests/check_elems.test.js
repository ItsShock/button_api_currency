const puppeteer = require('puppeteer');
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie nr. 2", () => {
  const timeout = 30000;
  let page;
  let didRequest;

  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      console.log(interceptedRequest)
      if (interceptedRequest.url() === 'https://api.frankfurter.app/latest') {
        didRequest = true;
      }
      interceptedRequest.continue();
    });
  }, timeout);

  afterAll(async () => {
    await browser.close();
  })

  it("Dodano button o odpowiednim ID", async () => {
    const button = await page.$eval("#getCurrencies", elem => !!elem);
    expect(button).toBe(true);
  }, timeout);

  it("Po kliknięciu w button, powinno pobrać listę walut i dodać je jako options do select", async () => {
    await page.click("#getCurrencies");

    await page.waitForSelector("select");
    const options = await page.$$eval("select option", elems => elems[0].value === elems[0].innerText);
    expect(options).toBe(true);
  }, timeout);

  it("Wszystko powinno być poprzedzone poprawnym requestem", async () => {
    expect(didRequest).toBe(true);
  }, timeout);
});
