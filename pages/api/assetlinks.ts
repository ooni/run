import type { NextApiRequest, NextApiResponse } from 'next'
import assetLinks from 'public/static/assetlinks.json'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).json(assetLinks)
}
