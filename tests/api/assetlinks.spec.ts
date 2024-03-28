import { expect, test } from "@playwright/test"
import assetlinks from "public/static/assetlinks.json"

test("/.well-known/assetlinks.json", async ({ request }) => {
  const response = await request.get("/.well-known/assetlinks.json")
  const body = await response.json()

  await expect(body).toEqual(assetlinks)
})
