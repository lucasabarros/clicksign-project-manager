import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('shows the empty state when there are no projects', async ({ page }) => {
  await expect(page.getByText('Nenhum projeto', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Novo projeto' })).toBeVisible()
})

test('creates a project and shows it in the listing', async ({ page }) => {
  await page.getByRole('button', { name: 'Novo projeto' }).click()
  await expect(page.getByRole('heading', { name: 'Novo projeto' })).toBeVisible()

  await page.getByLabel('Nome do projeto').fill('Projeto Teste E2E')
  await page.getByLabel('Cliente').fill('Clicksign')
  await page.getByLabel('Data de Início').fill('2025-01-10')
  await page.getByLabel('Data Final').fill('2025-06-10')
  await page.getByRole('button', { name: 'Salvar projeto' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText('Projeto Teste E2E')).toBeVisible()
  await expect(page.locator('.projects-toolbar__count')).toHaveText('(1)')
})

test('shows inline validation errors for an invalid form', async ({ page }) => {
  await page.getByRole('button', { name: 'Novo projeto' }).click()
  await page.getByRole('button', { name: 'Salvar projeto' }).click()

  await expect(page.getByText('Por favor, digite ao menos duas palavras')).toBeVisible()
  await expect(page.getByText('Por favor, digite ao menos uma palavra')).toBeVisible()
  await expect(page).toHaveURL(/\/projects\/new/)
})

test('favorites a project and filters by favorites only', async ({ page }) => {
  await page.getByRole('button', { name: 'Novo projeto' }).click()
  await page.getByLabel('Nome do projeto').fill('Projeto Favorito')
  await page.getByLabel('Cliente').fill('Clicksign')
  await page.getByLabel('Data de Início').fill('2025-01-10')
  await page.getByLabel('Data Final').fill('2025-06-10')
  await page.getByRole('button', { name: 'Salvar projeto' }).click()

  await page.getByRole('button', { name: 'Favoritar projeto' }).click()
  await page.getByLabel('Apenas Favoritos').check({ force: true })

  await expect(page.getByText('Projeto Favorito')).toBeVisible()

  await page.getByLabel('Apenas Favoritos').uncheck({ force: true })
})

test('deletes a project after confirming in the modal', async ({ page }) => {
  await page.getByRole('button', { name: 'Novo projeto' }).click()
  await page.getByLabel('Nome do projeto').fill('Projeto Para Remover')
  await page.getByLabel('Cliente').fill('Clicksign')
  await page.getByLabel('Data de Início').fill('2025-01-10')
  await page.getByLabel('Data Final').fill('2025-06-10')
  await page.getByRole('button', { name: 'Salvar projeto' }).click()

  await page.getByRole('button', { name: 'Mais opções do projeto' }).click()
  await page.getByRole('menuitem', { name: 'Remover' }).click()

  await expect(page.getByRole('heading', { name: 'Remover projeto' })).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar' }).click()

  await expect(page.getByText('Nenhum projeto', { exact: true })).toBeVisible()
})

test('persists projects after a page reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Novo projeto' }).click()
  await page.getByLabel('Nome do projeto').fill('Projeto Persistente')
  await page.getByLabel('Cliente').fill('Clicksign')
  await page.getByLabel('Data de Início').fill('2025-01-10')
  await page.getByLabel('Data Final').fill('2025-06-10')
  await page.getByRole('button', { name: 'Salvar projeto' }).click()

  await page.reload()

  await expect(page.getByRole('heading', { name: 'Projetos' })).toBeVisible()
  await expect(page.getByText('Projeto Persistente')).toBeVisible({ timeout: 10_000 })
})

test('editing a non-existent project id redirects to the listing', async ({ page }) => {
  await page.goto('/projects/does-not-exist/edit')
  await expect(page).toHaveURL('/')
  await expect(page.getByText('Projeto não encontrado.')).toBeVisible()
})

test('has no horizontal scroll on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
})
