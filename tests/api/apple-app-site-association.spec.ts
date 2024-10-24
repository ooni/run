import { expect, test } from '@playwright/test'
import appleAppSiteAssociation from 'public/static/apple-app-site-association.json'

test('apple-app-site-association', async ({ request }) => {
  const response = await request.get('/apple-app-site-association')
  const body = await response.json()

  await expect(body).toEqual(appleAppSiteAssociation)
})
