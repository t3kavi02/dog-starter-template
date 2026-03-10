import { test, expect } from '@playwright/test';

test.describe('Dog Image App - Positive E2E Tests', () => {
  test('should display a dog image when page loads', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/dogs/random') && response.status() === 200
    );
    
    const response = await responsePromise;
    
    expect(response.ok()).toBeTruthy();
    
    const dogImage = page.locator('img[alt*="dog" i], img.dog-image, img');
    
    await expect(dogImage).toBeVisible();
    
    const imageSrc = await dogImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toMatch(/^https:\/\//);
    
    const isImageLoaded = await dogImage.evaluate((img: HTMLImageElement) => img.complete);
    expect(isImageLoaded).toBeTruthy();
  });

  test('should fetch a new dog image when button is clicked', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.waitForResponse(
      response => response.url().includes('/api/dogs/random') && response.status() === 200
    );
    
    const dogImage = page.locator('img[alt*="dog" i], img.dog-image, img');
    await expect(dogImage).toBeVisible();
    const initialImageSrc = await dogImage.getAttribute('src');
    
    const button = page.locator('button:has-text("New Dog"), button:has-text("Fetch"), button.get-dog, button');
    await expect(button).toBeVisible();
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/dogs/random') && response.status() === 200
    );
    
    await button.click();
    
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
    
    await page.waitForTimeout(500);
    
    const newImageSrc = await dogImage.getAttribute('src');
    
    expect(newImageSrc).toBeTruthy();
    expect(newImageSrc).toMatch(/^https:\/\//);
    
    const isNewImageLoaded = await dogImage.evaluate((img: HTMLImageElement) => img.complete);
    expect(isNewImageLoaded).toBeTruthy();
  });
});

test.describe('Dog Image App - Negative E2E Tests', () => {
  test('should display error message when API call fails', async ({ page }) => {
    await page.route('**/api/dogs/random', route => route.abort());
    
    await page.goto('http://localhost:5173');
    
    const errorElement = page.locator('text=/error/i');
    
    await expect(errorElement).toBeVisible({ timeout: 10000 });
    
    const errorText = await errorElement.textContent();
    expect(errorText).toBeTruthy();
    
    console.log('Error message displayed:', errorText);
    
    const dogImage = page.locator('img[alt*="dog" i], img.dog-image, img');
    await expect(dogImage).toBeHidden();
  });
});