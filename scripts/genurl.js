// This requires babel-cli
import * as fs from "fs"
import { getUniversalLink } from "../utils/links"

const CSV_PATH = process.argv[2] || "../../test-lists/lists/global.csv"

fs.readFile(CSV_PATH, "utf8", (err, data) => {
  if (err) {
    return console.log(err)
  }
  const urls = data
    .split("\n")
    .map((x) => x.split(",")[0])
    .filter((x) => x !== "url" && x !== "")
  console.log(getUniversalLink(urls))
})
