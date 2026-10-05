import { type APIRequestContext, expect, test } from '@playwright/test'
import assetlinks from 'public/static/assetlinks.json'

const expectAssetLinks = async (
  request: APIRequestContext,
  path: string,
) => {
  const response = await request.get(path)
  expect(response.ok()).toBeTruthy()
  expect(response.headers()['content-type']).toContain('application/json')
  const body = await response.json()
  await expect(body).toEqual(assetlinks)
}

test('/.well-known/assetlinks.json', async ({ request }) => {
  await expectAssetLinks(request, '/.well-known/assetlinks.json')
})
