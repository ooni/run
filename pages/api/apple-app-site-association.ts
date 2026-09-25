import type { NextApiRequest, NextApiResponse } from 'next'
import appleAppSiteAssociation from 'public/static/apple-app-site-association.json'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).json(appleAppSiteAssociation)
}
