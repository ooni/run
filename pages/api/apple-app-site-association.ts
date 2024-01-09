import type { NextApiRequest, NextApiResponse } from "next"
import appleAppSiteAssociation from "public/static/apple-app-site-association.json"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(appleAppSiteAssociation)
}
