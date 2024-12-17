const {Builder, Browser, By, Key, until} = require('selenium-webdriver')

let driver;
const n = 5;

beforeAll(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterAll(async () => {
  await driver.manage().deleteAllCookies();
  await driver.quit();
});

test('correct login', async () => {
  await driver.get('http://localhost:5173/');

  await driver.wait(until.elementLocated(By.tagName("input")), 1000);
  await driver.findElement(By.tagName("input")).sendKeys("Ларсов Ульрих");
  await driver.findElement(By.tagName("button")).click();

  await driver.wait(until.urlIs("http://localhost:5173/profile/2"), 1000);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).toBe("http://localhost:5173/profile/2");
});

test('incorrect login', async () => {
  await driver.get('http://localhost:5173/');
  await driver.wait(until.elementLocated(By.tagName("input")), 1000);

  await driver.findElement(By.tagName("input")).sendKeys("Ларсов");
  await driver.findElement(By.tagName("button")).click();

  await driver.sleep(500);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).toBe("http://localhost:5173/");
});

test('click to panel', async () => {
  await driver.get('http://localhost:5173/profile/2');
  await driver.wait(until.elementLocated(By.css("a[href$='/panel']")), 1000);

  await driver.findElement(By.css("a[href$='/panel']")).click();

  await driver.wait(until.urlIs("http://localhost:5173/panel"), 1000);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).toBe("http://localhost:5173/panel");
});

test('buy stocks', async () => {
  await driver.get('http://localhost:5173/profile/2');
  await driver.wait(until.elementLocated(By.css("tr:first-child td:last-child input")), 1000);

  const priceElement = By.css("tr:first-child td:nth-child(2)");
  const valElement = By.css("tr:first-child td:nth-child(4)");
  const balanceElement = By.className("balance");

  const oldVal = Number(await driver.findElement(valElement).getText());
  const oldBalance = Number((await driver.findElement(balanceElement).getText()).match(/\d+(\.\d+)?/)[0]);
  const price = Number(await driver.findElement(priceElement).getText());

  await driver.findElement(By.css("tr:first-child td:last-child input")).sendKeys(n);
  await driver.findElement(By.css("tr:first-child td:last-child button[type='submit']")).click();


  await driver.wait(until.elementTextIs(driver.wait(until.elementLocated(valElement)), (oldVal + n).toString(10)), 1000);
  const newVal = Number(await driver.findElement(valElement).getText());
  const newBalance = Number((await driver.findElement(balanceElement).getText()).match(/\d+(\.\d+)?/)[0]);
  expect(newVal).toBe(oldVal + n);
  expect(newBalance).toBeCloseTo(oldBalance - price * n, 1);
});

test('sell stocks', async () => {
  await driver.get('http://localhost:5173/profile/2');
  await driver.wait(until.elementLocated(By.css("tr:first-child td:last-child input")), 1000);

  const valElement = By.css("tr:first-child td:nth-child(4)");
  const balanceElement = By.className("balance");

  const oldVal = Number(await driver.findElement(valElement).getText());
  const oldBalance = Number((await driver.findElement(balanceElement).getText()).match(/\d+(\.\d+)?/)[0]);


  await driver.findElement(By.css("tr:first-child td:last-child input")).sendKeys(n);
  await driver.findElement(By.css("tr:first-child td:last-child button[type='submit']")).click();
  await driver.wait(until.elementTextIs(driver.wait(until.elementLocated(valElement)), (oldVal + n).toString(10)), 1000);
  await driver.findElement(By.css("tr:first-child td:last-child input")).sendKeys(Key.BACK_SPACE, -n);
  await driver.findElement(By.css("tr:first-child td:last-child button[type='submit']")).click();


  await driver.wait(until.elementTextIs(driver.wait(until.elementLocated(valElement)), oldVal.toString(10)), 1000);
  const newVal = Number(await driver.findElement(valElement).getText());
  const newBalance = Number((await driver.findElement(balanceElement).getText()).match(/\d+(\.\d+)?/)[0]);
  expect(newVal).toBe(oldVal);
  expect(newBalance).toBeCloseTo(oldBalance, 1);
});

test('buy stocks with profit', async () => {
  await driver.get('http://localhost:5173/profile/2');
  await driver.wait(until.elementLocated(By.css("tr:first-child td:last-child input")), 1000);

  const priceElement = By.css("tr:first-child td:nth-child(2)");
  const profitElement = By.css("tr:first-child td:nth-child(5)");
  const valElement = By.css("tr:first-child td:nth-child(4)");

  const oldPrice = Number(await driver.findElement(priceElement).getText());
  const oldProfit = Number(await driver.findElement(profitElement).getText());


  await driver.findElement(By.css("tr:first-child td:last-child input")).sendKeys(n);
  await driver.findElement(By.css("tr:first-child td:last-child button[type='submit']")).click();

  await driver.wait(until.elementTextMatches(driver.wait(until.elementLocated(priceElement)), new RegExp(`^(?!${oldPrice}).*$`, 'g')), 5000);

  const newPrice = Number(await driver.findElement(priceElement).getText());
  const newProfit = Number(await driver.findElement(profitElement).getText());
  const newVal = Number(await driver.findElement(valElement).getText());
  expect(newProfit).toBeCloseTo(oldProfit + (newPrice - oldPrice) * newVal, 0);
});
