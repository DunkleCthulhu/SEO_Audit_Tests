import { test, expect } from '@playwright/test';
import pages from './pages.json';

for (const page of pages) {
  const { name, url } = page;
  test(`Check h1 tag on ${page.name} page`, async ({ page }) => {
    await page.goto(url);

    //Перевіряємо, що tag h1 присутній на сторінці
    const h1Elements = await page.$$('h1');  
    expect(h1Elements.length).toBeGreaterThan(0); 

    //Перевіряємо, що tag h1 присутній на сторінці тільки в одному екземплярі
    const h1Count = await page.$$eval('h1', elements => elements.length);
    expect(h1Count).toBeLessThanOrEqual(1);
  });

  test(`Check canonical url on ${page.name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо, що tag canonical присутній на сторінці
    const canonicalLinks = await page.$$('link[rel="canonical"]');
    expect(canonicalLinks.length).toBeGreaterThan(0);
  });

  test(`Check canonical url on ${page.name} page matches current page url`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо, що canonicalUrl відповідає url поточної сторінки 
  const currentUrl = page.url();  
  const canonicalLink = await page.$('link[rel="canonical"]');
  if (canonicalLink !== null) {
    const canonicalUrl = await canonicalLink.getAttribute('href');    
    expect(canonicalUrl).toBe(currentUrl);
  } else {    
    throw new Error('Canonical link not found');
  }

  // Переввіряємо, що після переходу на данний url він відповідає початковуму url і не відбувається редіректів
  const response = await page.goto(currentUrl, { waitUntil: 'domcontentloaded' });
  if (response !== null) {
    const finalUrl = response.url();
    expect(finalUrl).toBe(currentUrl);
  } else {
    throw new Error('Failed to load page')
  }
  });

  test(`Check Open Graph meta tags on ${page.name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо, що Open Graph meta tags присутні на сторінці і налаштовані згідно документації
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toBeTruthy();

  const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
  expect(ogType).toBeTruthy();

  const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(ogImage).toBeTruthy();

  const ogUrl = await page.getAttribute('meta[property="og:description"]', 'content');
  expect(ogUrl).toBeTruthy();

  const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
  expect(ogDescription).toBeTruthy();
  });

  test(`Check the absence of a noindex tag on ${page.name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо відсутність noindex tag на сторінці 
  const noIndexTag = await page.$('meta[name="robots"][content="noindex"]');
  expect(noIndexTag).toBeFalsy(); 
  });

  test(`Check h1 tag does not duplicate title on ${page.name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо, що tag h1 не дублює tag title
  const titleText = await page.title(); 
  const h1Element = await page.$('h1');
  const h1Text = h1Element ? await h1Element.textContent() : null;

  if (h1Text !== null) {
    expect(h1Text.trim()).not.toBe(titleText.trim());
  } else {
    throw new Error('h1 element not found');
  }
  });

  test(`Check the absence of a nofollow tag on ${name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо, що tag nofollow відсутній на сторінці
    const noFollowTag = await page.$('meta[name="robots"][content="nofollow"]');
    expect(noFollowTag).toBeFalsy(); 
  });

  test(`Check Twitter card tags on ${name} page`, async ({ page }) => {
    await page.goto(url);

    // Перевіряємо,  наявності тегів Twitter card
    const twitterCardTag = await page.$('meta[name="twitter:card"]');
    expect(twitterCardTag).toBeTruthy();

    const twitterTitleTag = await page.$('meta[name="twitter:title"]');
    expect(twitterTitleTag).toBeTruthy();

    const twitterDescriptionTag = await page.$('meta[name="twitter:description"]');
    expect(twitterDescriptionTag).toBeTruthy();

    const twitterImageTag = await page.$('meta[name="twitter:image"]');
    expect(twitterImageTag).toBeTruthy();    
  });

}











