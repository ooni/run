import { type APIRequestContext, expect, test } from '@playwright/test'
import appleAppSiteAssociation from 'public/static/apple-app-site-association.json'

const expectAppleAppSiteAssociation = async (
  request: APIRequestContext,
  path: string,
) => {
  const response = await request.get(path)
  expect(response.ok()).toBeTruthy()
  expect(response.headers()['content-type']).toContain('application/json')
  const body = await response.json()
  await expect(body).toEqual(appleAppSiteAssociation)
}

test('apple-app-site-association', async ({ request }) => {
  await expectAppleAppSiteAssociation(request, '/apple-app-site-association')
})

test('.well-known/apple-app-site-association', async ({ request }) => {
  await expectAppleAppSiteAssociation(
    request,
    '/.well-known/apple-app-site-association',
  )
})
