import { test, expect } from '@playwright/test';

const baseUrl = "https://onix-systems.com/"

test('Check h1 tag', async ({ page }) => {
  await page.goto(baseUrl);
  const h1Elements = await page.$$('h1');
  expect(h1Elements.length).toBeGreaterThan(0);  
});

test('Check canonical url', async ({ page }) => {
  await page.goto(baseUrl);
  const canonicalLinks = await page.$$('link[rel="canonical"]');
  expect(canonicalLinks.length).toBeGreaterThan(0);  
});

test('Check Open Graph meta tags', async ({ page }) => {
  await page.goto(baseUrl);

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

test('Check for noindex tag', async ({ page }) => {
  await page.goto(baseUrl);
  const noIndexTag = await page.$('meta[name="robots"][content="noindex"]');
  expect(noIndexTag).toBeFalsy(); 
});

test('Check h1 does not duplicate title', async ({ page }) => {
  await page.goto(baseUrl);  

  const titleText = await page.title(); 
  const h1Element = await page.$('h1');
  const h1Text = h1Element ? await h1Element.textContent() : null;

  if (h1Text !== null) {
    expect(h1Text.trim()).not.toBe(titleText.trim());
  } else {
    throw new Error('h1 element not found');
  }
});





