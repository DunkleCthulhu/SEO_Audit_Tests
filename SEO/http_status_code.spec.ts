import { test, expect } from '@playwright/test';
import pages from './pages.json';

for (const { name, url } of pages) {
  test(`Check HTTP status code for ${name} page`, async ({ page }) => {
    const response = await page.goto(url);

    // Перевіряємо, що відповідь не null
    expect(response).not.toBeNull();

    if (response !== null) {
      // Перевіряємо HTTP статус-коду 
      expect(response.status()).not.toBe(500);
      // Перевіряємо, будь-яку помилку сервера (500+)
      expect(response.status()).not.toBeGreaterThan(500); 
    }
  });

  test(`Check response content for ${name} page with modified URLs`, async ({ page }) => {
    const baseUrl = await page.goto(url);
    const currentUrl = page.url();
    const modifiedUrl1 = `${currentUrl}/asdasfafd`;
    const modifiedUrl2 = `${currentUrl}/іаівтаілва`;

    // Переходимо на перший модифікований URL
    await page.goto(modifiedUrl1);
    expect(page.url()).toBe(modifiedUrl1);
    // Отримуємо текст сторінки
    const pageText1 = await page.textContent('html');
    // Перевіряємо, чи є текст "Oh no! Something went wrong. We are working to resolve the problem"
    expect(pageText1).toContain('Oh no! Something went wrong. We are working to resolve the problem');
    // Перевіряємо, чи є кнопка "Return to main page"
    const returnButton1 = await page.$('button:has-text("Return to main page")');
    expect(returnButton1).not.toBeNull();
    
    // Переходимо на другий модифікований URL
    await page.goto(modifiedUrl2);
    expect(page.url()).toBe(modifiedUrl2);
    // Отримуємо текст сторінки
    const pageText2 = await page.textContent('html');
    // Перевіряємо, чи є текст "Oh no! Something went wrong. We are working to resolve the problem"
    expect(pageText2).toContain('Oh no! Something went wrong. We are working to resolve the problem');
    // Перевіряємо, чи є кнопка "Return to main page"
    const returnButton2 = await page.$('button:has-text("Return to main page")');
    expect(returnButton2).not.toBeNull();
});
  
}