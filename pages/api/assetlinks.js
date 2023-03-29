import assetLinks from "public/static/assetlinks.json"

export default function handler(req, res) {
  res.status(200).json(assetLinks)
}