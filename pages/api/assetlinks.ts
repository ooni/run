import type { NextApiRequest, NextApiResponse } from 'next'
import assetLinks from 'public/static/assetlinks.json'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(assetLinks)
}
