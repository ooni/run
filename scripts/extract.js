const { readFileSync, writeFileSync } = require("fs")
const { resolve } = require("path")
const glob = require("glob")
const { spawnSync } = require("child_process")

// formatjs cli doesn't currently support globbing, so we perform it ourselves
// as a workaround. see https://github.com/formatjs/formatjs/issues/383
const sourceFiles = glob.sync(process.argv[2])
spawnSync("npx", [
  "formatjs",
  "extract",
  "--messages-dir",
  "lang/.messages/",
  "--out-file",
  "./lang/.messages/en-to-csv.json",
  "--extract-from-format-message-call",
  ...sourceFiles,
])
console.log(
  `> Wrote default messages to: "${resolve(
    "./lang/.messages/en-to-csv.json",
  )}"`,
)

// npx json2csv -H -i en.json -f id,defaultMessage
spawnSync("npx", [
  "json2csv",
  "--no-header",
  "--fields",
  "id,defaultMessage",
  "--input",
  "lang/en.json",
  "--output",
  "lang/.messages/en.csv",
])
console.log(
  `> Wrote CSV formatted file to: "${resolve("./lang/.messages/en.csv")}"`,
)

const defaultMessages = glob
  .sync("./lang/.messages/**/*.json")
  .map((filename) => readFileSync(filename, "utf8"))
  .map((file) => JSON.parse(file))
  .reduce((messages, descriptors) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    descriptors.forEach(({ id, defaultMessage }) => {
      // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
      if (messages.hasOwnProperty(id) && messages[id] !== defaultMessage) {
        throw new Error(
          `Duplicate message id: ${id} (duplicate message ids are allowed, but only if the defaultMessages match!)`,
        )
      }
      messages[id] = defaultMessage
    })
    return messages
  }, {})

writeFileSync("./lang/en.json", JSON.stringify(defaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve("./lang/en.json")}"`)
