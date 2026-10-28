const { test, expect } = require('@playwright/test');
const path = require('path');

const fileUrl = `file://${path.resolve(__dirname, 'index.html')}`;

test.describe('тест api', () => {

    test('перехват запроса и подставление данных мок', async ({ page }) => {

        await page.route('https://typicode.com', async route => {
            const json = {
                userId: 1,
                id: 1,
                title: 'Playwright Mock',
                completed: false
            };
            await route.fulfill({ json });
        });

        await page.goto(fileUrl);

        const todoTitle = page.locator('#todo-title');
        await expect(todoTitle).toHaveText('Playwright Mock');
        
        await expect(page.locator('#data-container')).toBeVisible();
        await expect(page.locator('#error-message')).toBeEmpty();
    });

    test('обработка ошибки 403 и отображение для юзера', async ({ page }) => {

        await page.route('https://typicode.com', async route => {
            await route.fulfill({
                status: 403,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Forbidden' })
            });
        });

        await page.goto(fileUrl);

        const errorMessage = page.locator('#error-message');
        await expect(errorMessage).toHaveText('ошибка 403');

        await expect(page.locator('#data-container')).not.toBeVisible();
    });
});
