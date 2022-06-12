const fs = require("fs")
const path = require("path")

function read(identifier) {
    let contents = `${identifier}.toml: not found`
    try {
        contents = fs.readFileSync(path.join(__dirname, `${identifier}.toml`), "utf8")
        console.log(`read: ${identifier}.toml`)
    } catch (err) {
        throw new Error(`could not load: ${identifier}.toml`)
    }
    return contents
}

function write(identifier, contents) {
    try {
        fs.writeFileSync(path.join(__dirname, `${identifier}.toml`), contents)
        console.log(`wrote: ${identifier}.toml`)
    } catch (err) {
        console.log("could not write to:", path.join(__dirname, `${identifier}.toml`))
    }
}

module.exports = { read, write }
