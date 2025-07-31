import { test, expect } from '@playwright/test';

test.describe('Finance App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main app', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: 'FinançasFácil' })).toBeVisible();
    
    // Check if navigation items are present
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transações' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Categorias' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Relatórios' })).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find the dark mode toggle button (moon icon initially)
    const darkModeToggle = page.locator('button[aria-label*="Ativar modo escuro"], button[aria-label*="Ativar modo claro"]').first();
    
    // Check initial state (should be light mode)
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Click dark mode toggle
    await darkModeToggle.click();
    
    // Verify dark mode is activated
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Click again to toggle back to light mode
    await darkModeToggle.click();
    
    // Verify light mode is restored
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should open transaction form', async ({ page }) => {
    // Click on "Nova Transação" button (should be in dashboard)
    await page.getByRole('button', { name: /Nova Transação|Adicionar Transação/i }).first().click();
    
    // Check if transaction form modal is open
    await expect(page.getByRole('heading', { name: 'Nova Transação' })).toBeVisible();
    
    // Check if form fields are present
    await expect(page.getByLabel('Valor')).toBeVisible();
    await expect(page.getByLabel('Categoria')).toBeVisible();
    await expect(page.getByLabel('Data')).toBeVisible();
    await expect(page.getByLabel('Descrição')).toBeVisible();
  });

  test('should test currency input functionality', async ({ page }) => {
    // Open transaction form
    await page.getByRole('button', { name: /Nova Transação|Adicionar Transação/i }).first().click();
    
    // Wait for form to be visible
    await expect(page.getByRole('heading', { name: 'Nova Transação' })).toBeVisible();
    
    // Find the currency input field
    const amountInput = page.getByLabel('Valor');
    
    // Test the currency input - type "30" should become "30,00"
    await amountInput.fill('30');
    await amountInput.blur();
    
    // Check if the value was formatted correctly
    await expect(amountInput).toHaveValue('30,00');
    
    // Test clearing the field
    await amountInput.selectText();
    await amountInput.press('Delete');
    await expect(amountInput).toHaveValue('');
    
    // Test decimal input
    await amountInput.fill('30,5');
    await amountInput.blur();
    await expect(amountInput).toHaveValue('30,50');
  });

  test('should show category color preview', async ({ page }) => {
    // First, navigate to categories to ensure we have some categories
    await page.getByRole('button', { name: 'Categorias' }).click();
    
    // Go back to dashboard and open transaction form
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await page.getByRole('button', { name: /Nova Transação|Adicionar Transação/i }).first().click();
    
    // Wait for form to be visible
    await expect(page.getByRole('heading', { name: 'Nova Transação' })).toBeVisible();
    
    // Select a category if available
    const categorySelect = page.getByLabel('Categoria');
    
    // Get all options (skip the first one which is "Selecione uma categoria")
    const options = await categorySelect.locator('option').allTextContents();
    
    if (options.length > 1) {
      // Select the first real category (not the placeholder)
      await categorySelect.selectOption({ index: 1 });
      
      // Check if category color preview appears
      // This should show a color swatch with category information
      await expect(page.locator('.bg-gray-50')).toBeVisible();
    }
  });

  test('should navigate between views', async ({ page }) => {
    // Test navigation to Transações
    await page.getByRole('button', { name: 'Transações' }).click();
    await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible();
    
    // Test navigation to Categorias
    await page.getByRole('button', { name: 'Categorias' }).click();
    await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible();
    
    // Test navigation to Relatórios
    await page.getByRole('button', { name: 'Relatórios' }).click();
    await expect(page.getByRole('heading', { name: 'Relatórios' })).toBeVisible();
    
    // Navigate back to Dashboard
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should handle form validation', async ({ page }) => {
    // Open transaction form
    await page.getByRole('button', { name: /Nova Transação|Adicionar Transação/i }).first().click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Adicionar|Salvar/i }).click();
    
    // Should show validation errors (form should still be open)
    await expect(page.getByRole('heading', { name: 'Nova Transação' })).toBeVisible();
  });
});

test.describe('Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show mobile navigation', async ({ page }) => {
    await page.goto('/');
    
    // On mobile, navigation should be at the bottom
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transações' })).toBeVisible();
    
    // Dark mode toggle should also be visible on mobile
    const darkModeToggle = page.locator('button[aria-label*="Ativar modo escuro"], button[aria-label*="Ativar modo claro"]').first();
    await expect(darkModeToggle).toBeVisible();
  });
});