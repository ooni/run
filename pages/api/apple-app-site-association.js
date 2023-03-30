import appleAppSiteAssociation from "public/static/apple-app-site-association"

export default function handler(req, res) {
  res.status(200).json(appleAppSiteAssociation)
}